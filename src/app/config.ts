export const isConfigName = (config: any): config is ConfigName => {
  return Object.values(ConfigName).includes(config);
};

export interface Config {
  name: ConfigName;
  ui: {
    title: string;
    imageAlt: string;
  };
  suggestionGeneration: {
    systemPrompt: string;
  };
  imageGeneration: {
    detailedPromptGeneration: {
      systemPrompt: string;
    };
  };
}

export enum ConfigName {
  COOKIES = "cookies",
  DINNER = "dinner",
  BOOKS = "books",
  VACATION = "vacation",
  GEL_NAIL_ART = "gelNailArt",
}

const GLOBAL: Partial<Config> = {
  suggestionGeneration: {
    systemPrompt:
      'You will respond with strictly structured data. Do not add any other pleasantries or responses. Each of the values should be on a new line. First name ("NAME=[replace_with_name]"), then description ("DESCRIPTION=[replace_with_description]"). Any input message, if provided, can be taken as a rough idea that the user wants to explore further.',
  },
  imageGeneration: {
    detailedPromptGeneration: {
      systemPrompt:
        "Image only without typography. The background should not be too bright. You should only output the suggestion to be fed directly to dall-e-3, no pleasentries or addition response content. There should be no humans or animals. ",
    },
  },
};

export const configs: Record<ConfigName, Config> = {
  cookies: {
    name: ConfigName.COOKIES,
    ui: {
      title: "Cookie Creator",
      imageAlt: "Generated image of the cookie",
    },
    suggestionGeneration: {
      systemPrompt: `You are an assitant that will suggest the name of a random cookie, with a topping, with a short description that accurately details each component. ${GLOBAL.suggestionGeneration?.systemPrompt}`,
    },
    imageGeneration: {
      detailedPromptGeneration: {
        systemPrompt: `You are an assistant that will take the name and description of a random cookie and provide a highly detailed prompt for dall-e-3 image generation to generate a realistic image of the cookie. It should detail all aspects of the cookie image. The cookie should be by itself and any toppings should be realistic in colour, shade and scale and should be well incorporated into the cookie.  The single cookie should be center focus. ${GLOBAL.imageGeneration?.detailedPromptGeneration.systemPrompt}`,
      },
    },
  },

  dinner: {
    name: ConfigName.DINNER,
    ui: {
      title: "Dinner Dynamo",
      imageAlt: "Generated image of the dinner",
    },
    suggestionGeneration: {
      systemPrompt: `You are an assitant that will suggest the name of a random dinner, with a short description that accurately details each component. ${GLOBAL.suggestionGeneration?.systemPrompt}`,
    },
    imageGeneration: {
      detailedPromptGeneration: {
        systemPrompt: `You are an assistant that will take the name and description of a random dinner and provide a highly detailed prompt for dall-e-3 image generation to generate a realistic image of the dinner. It should detail all aspects of the dinner image. The dinner should be by itself and should be realistic in colour, shade and scale.  The single dinner should be center focus. ${GLOBAL.imageGeneration?.detailedPromptGeneration.systemPrompt}`,
      },
    },
  },

  books: {
    name: ConfigName.BOOKS,
    ui: {
      title: "Book Buddy",
      imageAlt: "Generated image of the book",
    },
    suggestionGeneration: {
      systemPrompt: `You are an assitant that will suggest the name of a real book for the user to read, with a short description that accurately details the plot and author. ${GLOBAL.suggestionGeneration?.systemPrompt}`,
    },
    imageGeneration: {
      detailedPromptGeneration: {
        systemPrompt: `You are an assistant that will take the name and description of a random book and provide a highly detailed prompt for dall-e-3 image generation to generate a realistic image that depicts the book. It should detail aspects of the book summary. The book should be by itself and should be realistic in colour, shade and scale. ${GLOBAL.imageGeneration?.detailedPromptGeneration.systemPrompt}`,
      },
    },
  },

  vacation: {
    name: ConfigName.VACATION,
    ui: {
      title: "Vacation Vision",
      imageAlt: "Generated image of the vacation spot",
    },
    suggestionGeneration: {
      systemPrompt: `You are an assitant that will suggest the name of a real vacation for the user to enjoy, with a short description of things to do and why they would enjoy it. ${GLOBAL.suggestionGeneration?.systemPrompt}`,
    },
    imageGeneration: {
      detailedPromptGeneration: {
        systemPrompt: `You are an assistant that will take the name and description of a random vacation and provide a highly detailed prompt for dall-e-3 image generation to generate a realistic image that depicts the vacation. It should detail aspects of the vacation description. The vacation image should be realistic in colour, shade and scale. ${GLOBAL.imageGeneration?.detailedPromptGeneration.systemPrompt}`,
      },
    },
  },

  gelNailArt: {
    name: ConfigName.GEL_NAIL_ART,
    ui: {
      title: "Nail Art Navigator",
      imageAlt: "Generated image of gel nail art",
    },
    suggestionGeneration: {
      systemPrompt: `You are an assitant that will suggest the name of a real nail art style for the user to try, with a short description of what it looks like. ${GLOBAL.suggestionGeneration?.systemPrompt}`,
    },
    imageGeneration: {
      detailedPromptGeneration: {
        systemPrompt: `You are an assistant that will take the name and description of a random nail art style/design and provide a highly detailed prompt for dall-e-3 image generation to generate a realistic image that depicts the nail art. It should detail aspects of the nail art description. The nail art image should be realistic in colour, shade and scale. Show a single hand with the nails painted in the described style. ${GLOBAL.imageGeneration?.detailedPromptGeneration.systemPrompt}`,
      },
    },
  },
};
