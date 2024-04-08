"use client";

import { useChat } from "ai/react";
import Image from "next/image";
import { ChangeEvent, useEffect, useMemo, useRef, useState } from "react";
import { Config, ConfigName } from "./config";

const Loading = ({ context }: { context?: string }) => {
  return <p>Loading{context ? ` ${context}` : ""}...</p>;
};

const ANYTHING = "...";

const SHOULD_GENERATE_IMAGE =
  process.env.NEXT_PUBLIC_SHOULD_GENERATE_IMAGE === "true";

const searchImage = async (prompt: string, config: ConfigName) => {
  const response = await fetch("/api/image", {
    method: "POST",
    body: JSON.stringify({ prompt, config }),
  });

  const data = await response.json();

  return data.url;
};

const isErrorInstance = (error: any): error is Error => {
  return error instanceof Error;
};

export function Suggester({ config }: { config: Config }) {
  const {
    messages,
    handleInputChange,
    handleSubmit,
    error,
    isLoading,
    setInput,
    input,
  } = useChat({
    api: "/api/suggest",
    body: {
      config: config.name,
    },
  });

  const [innerInput, setInnerInput] = useState("");

  useEffect(() => {
    setInput(ANYTHING);
  }, [setInput]);

  const [hasRoughIdeas, setHasRoughIdeas] = useState(false);

  const responses = useMemo(
    () => messages.filter((m) => m.role === "assistant"),
    [messages]
  );

  const [images, setImages] = useState<
    Record<string, { src?: string; isLoading: boolean }>
  >({});

  const setImage = async (id: string, content: string) => {
    setImages((prev) => ({
      ...prev,
      [id]: { isLoading: true },
    }));
    const image = await searchImage(content, config.name);
    setImages((prev) => ({ ...prev, [id]: { src: image, isLoading: false } }));
  };

  const generateImage = async (id: string) => {
    if (!SHOULD_GENERATE_IMAGE || messages.length === 0) {
      return;
    }

    const foundMessage = messages.find((m) => m.id === id);
    const foundContent = foundMessage?.content;

    if (
      !foundContent ||
      foundContent === ANYTHING ||
      foundContent === innerInput
    ) {
      return;
    }

    const content = foundContent.replace(/^(NAME|DESCRIPTION)=.*?\n?/gm, "");

    await setImage(id, content);
  };

  const roughIdeasInput = useRef<HTMLInputElement>(null);

  const isError = isErrorInstance(error);

  const updateRoughIdeas = (event: ChangeEvent<HTMLInputElement>) => {
    setInnerInput(event.target.value);
    handleInputChange(event);
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24 w-full">
      <h1>{config.ui.title}</h1>

      <form
        onSubmit={(event) => {
          event.preventDefault();
          handleSubmit(event);
        }}
      >
        <button type="submit">{isLoading ? "Loading..." : "Create"}</button>

        {isError && (
          <p>
            {error.name} --- {error.message}
          </p>
        )}

        <p
          className="cursor-pointer"
          onClick={() => {
            setHasRoughIdeas(!hasRoughIdeas);

            setTimeout(() => {
              roughIdeasInput.current?.focus();
            }, 0);
          }}
        >
          Already got some rough ideas?
        </p>

        {hasRoughIdeas && (
          <input
            ref={roughIdeasInput}
            className="bg-gray-800 border border-white border-solid p-4 rounded mb-4"
            value={innerInput}
            onChange={(event) => {
              updateRoughIdeas(event);
            }}
          />
        )}

        {isLoading && <Loading />}

        <div className="flex flex-row items-start justify-start flex-wrap gap-[16px] max-w-[1040px]">
          {responses.reverse().map((m, i) => {
            const [name, description] = m.content
              .replace(/^(NAME|DESCRIPTION)=/gm, "")
              .split("\n");
            return (
              <div
                key={m.id}
                className={`border border-white border-solid rounded relative max-h-[512px] min-h-[256px] w-[512px] w-full overflow-hidden`}
              >
                {images[m.id]?.isLoading ? (
                  <Loading context="image" />
                ) : images[m.id]?.src ? (
                  <Image
                    src={images[m.id].src as string}
                    alt={config.ui.imageAlt}
                    width={512}
                    height={512}
                    className="rounded w-full"
                  />
                ) : SHOULD_GENERATE_IMAGE ? (
                  <button onClick={() => generateImage(m.id)}>
                    Generate image
                  </button>
                ) : null}
                <div className="absolute left-0 bottom-0 z-10 text-white bg-black bg-opacity-50 w-full p-4 font-mono">
                  <p className="text-lg font-bold ">{name}</p>
                  <p className="text-sm font-medium">{description}</p>
                </div>
              </div>
            );
          })}
        </div>
      </form>
    </main>
  );
}
