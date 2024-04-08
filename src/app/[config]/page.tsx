"use client";

import { Suggester } from "../Suggester";
import { configs, isConfigName } from "../config";
import { useRouter } from "next/navigation";

export default function Config({ params }: { params: { config: string } }) {
  const router = useRouter();

  if (!isConfigName(params.config)) {
    return <p>Invalid config</p>;
  }

  const config = configs[params.config];

  return (
    <div>
      <button
        onClick={() => {
          router.back();
        }}
      >
        Go Back
      </button>
      <Suggester config={config} />
    </div>
  );
}
