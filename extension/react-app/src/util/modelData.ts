import _ from "lodash";

function updatedObj(old: any, pathToValue: { [key: string]: any }) {
  const newObject = _.cloneDeep(old);
  for (const key in pathToValue) {
    if (typeof pathToValue[key] === "function") {
      _.updateWith(newObject, key, pathToValue[key]);
    } else {
      _.updateWith(newObject, key, (__) => pathToValue[key]);
    }
  }
  return newObject;
}

export enum ModelProviderTag {
  "Requires API Key" = "Requires API Key",
  "Local" = "Local",
  "Free" = "Free",
  "Open-Source" = "Open-Source",
}

export const MODEL_PROVIDER_TAG_COLORS: any = {};
MODEL_PROVIDER_TAG_COLORS[ModelProviderTag["Requires API Key"]] = "#FF0000";
MODEL_PROVIDER_TAG_COLORS[ModelProviderTag["Local"]] = "#00bb00";
MODEL_PROVIDER_TAG_COLORS[ModelProviderTag["Open-Source"]] = "#0033FF";
MODEL_PROVIDER_TAG_COLORS[ModelProviderTag["Free"]] = "#ffff00";

export enum CollectInputType {
  "text" = "text",
  "number" = "number",
  "range" = "range",
}

export interface InputDescriptor {
  inputType: CollectInputType;
  key: string;
  label: string;
  placeholder?: string;
  defaultValue?: string | number;
  min?: number;
  max?: number;
  step?: number;
  options?: string[];
  required?: boolean;
  description?: string;
  [key: string]: any;
}

const contextLengthInput: InputDescriptor = {
  inputType: CollectInputType.number,
  key: "context_length",
  label: "Context Length",
  defaultValue: 2048,
  required: false,
};
const temperatureInput: InputDescriptor = {
  inputType: CollectInputType.number,
  key: "temperature",
  label: "Temperature",
  defaultValue: undefined,
  required: false,
  min: 0.0,
  max: 1.0,
  step: 0.01,
};
const topPInput: InputDescriptor = {
  inputType: CollectInputType.number,
  key: "top_p",
  label: "Top-P",
  defaultValue: undefined,
  required: false,
  min: 0,
  max: 1,
  step: 0.01,
};
const topKInput: InputDescriptor = {
  inputType: CollectInputType.number,
  key: "top_k",
  label: "Top-K",
  defaultValue: undefined,
  required: false,
  min: 0,
  max: 1,
  step: 0.01,
};
const presencePenaltyInput: InputDescriptor = {
  inputType: CollectInputType.number,
  key: "presence_penalty",
  label: "Presence Penalty",
  defaultValue: undefined,
  required: false,
  min: 0,
  max: 1,
  step: 0.01,
};
const FrequencyPenaltyInput: InputDescriptor = {
  inputType: CollectInputType.number,
  key: "frequency_penalty",
  label: "Frequency Penalty",
  defaultValue: undefined,
  required: false,
  min: 0,
  max: 1,
  step: 0.01,
};
const completionParamsInputs = [
  contextLengthInput,
  temperatureInput,
  topKInput,
  topPInput,
  presencePenaltyInput,
  FrequencyPenaltyInput,
];

const serverUrlInput = {
  inputType: CollectInputType.text,
  key: "server_url",
  label: "Server URL",
  placeholder: "e.g. http://localhost:8080",
  required: false,
};

export interface ModelInfo {
  title: string;
  class: string;
  description: string;
  longDescription?: string;
  icon?: string;
  tags?: ModelProviderTag[];
  packages: ModelPackage[];
  params?: any;
  collectInputFor?: InputDescriptor[];
}

// A dimension is like parameter count - 7b, 13b, 34b, etc.
// You would set options to the field that should be changed for that option in the params field of ModelPackage
export interface PackageDimension {
  name: string;
  description: string;
  options: { [key: string]: { [key: string]: any } };
}

export interface ModelPackage {
  collectInputFor?: InputDescriptor[];
  description: string;
  title: string;
  refUrl?: string;
  tags?: ModelProviderTag[];
  icon?: string;
  params: {
    model: string;
    template_messages?: string;
    context_length: number;
    stop_tokens?: string[];
    prompt_templates?: any;
    replace?: [string, string][];
    [key: string]: any;
  };
  dimensions?: PackageDimension[];
}

const codeLlamaInstruct: ModelPackage = {
  title: "CodeLlama Instruct",
  description:
    "A model from Meta, fine-tuned for code generation and conversation",
  refUrl: "",
  params: {
    title: "CodeLlama-7b-Instruct",
    model: "codellama:7b-instruct",
    context_length: 2048,
    template_messages: "llama2_template_messages",
  },
  icon: "meta.svg",
  dimensions: [
    {
      name: "Parameter Count",
      description: "The number of parameters in the model",
      options: {
        "7b": {
          model: "codellama:7b-instruct",
          title: "CodeLlama-7b-Instruct",
        },
        "13b": {
          model: "codellama:13b-instruct",
          title: "CodeLlama-13b-Instruct",
        },
        "34b": {
          model: "codellama:34b-instruct",
          title: "CodeLlama-34b-Instruct",
        },
      },
    },
  ],
};

const llama2Chat: ModelPackage = {
  title: "Llama2 Chat",
  description: "The latest Llama model from Meta, fine-tuned for chat",
  refUrl: "",
  params: {
    title: "Llama2-7b-Chat",
    model: "llama2:7b-chat",
    context_length: 2048,
    template_messages: "llama2_template_messages",
  },
  icon: "meta.svg",
  dimensions: [
    {
      name: "Parameter Count",
      description: "The number of parameters in the model",
      options: {
        "7b": {
          model: "llama2:7b-chat",
          title: "Llama2-7b-Chat",
        },
        "13b": {
          model: "llama2:13b-chat",
          title: "Llama2-13b-Chat",
        },
        "34b": {
          model: "llama2:34b-chat",
          title: "Llama2-34b-Chat",
        },
      },
    },
  ],
};

const gpt4: ModelPackage = {
  title: "GPT-4",
  description: "The latest model from OpenAI",
  params: {
    model: "gpt-4",
    context_length: 8096,
    api_key: "",
    title: "GPT-4",
  },
};

const gpt35turbo: ModelPackage = {
  title: "GPT-3.5-Turbo",
  description:
    "A faster, cheaper OpenAI model with slightly lower capabilities",
  params: {
    model: "gpt-3.5-turbo",
    context_length: 8096,
    title: "GPT-3.5-Turbo",
    api_key: "",
  },
};

export const MODEL_INFO: { [key: string]: ModelInfo } = {
  openai: {
    title: "OpenAI",
    class: "OpenAI",
    description: "Use gpt-4, gpt-3.5-turbo, or any other OpenAI model",
    longDescription:
      "Use gpt-4, gpt-3.5-turbo, or any other OpenAI model. See [here](https://openai.com/product#made-for-developers) to obtain an API key.",
    icon: "openai.svg",
    tags: [ModelProviderTag["Requires API Key"]],
    packages: [gpt4, gpt35turbo],
    collectInputFor: [
      {
        inputType: CollectInputType.text,
        key: "api_key",
        label: "API Key",
        placeholder: "Enter your OpenAI API key",
        required: true,
      },
      ...completionParamsInputs,
    ],
  },
  anthropic: {
    title: "Anthropic",
    class: "AnthropicLLM",
    description:
      "Claude-2 is a highly capable model with a 100k context length",
    icon: "anthropic.png",
    tags: [ModelProviderTag["Requires API Key"]],
    longDescription:
      "To get started with Anthropic models, you first need to sign up for the open beta [here](https://claude.ai/login) to obtain an API key.",
    collectInputFor: [
      {
        inputType: CollectInputType.text,
        key: "api_key",
        label: "API Key",
        placeholder: "Enter your Anthropic API key",
        required: true,
      },
      ...completionParamsInputs,
    ],
    packages: [
      {
        title: "Claude-2",
        description: "A highly capable model with a 100k context length",
        params: {
          model: "claude-2",
          context_length: 100000,
          title: "Claude-2",
        },
      },
    ],
  },
  ollama: {
    title: "Ollama",
    class: "Ollama",
    description:
      "One of the fastest ways to get started with local models on Mac or Linux",
    longDescription:
      'To get started with Ollama, follow these steps:\n1. Download from [ollama.ai](https://ollama.ai/) and open the application\n2. Open a terminal and run `ollama pull <MODEL_NAME>`. Example model names are `codellama:7b-instruct` or `llama2:7b-text`. You can find the full list [here](https://ollama.ai/library).\n3. Make sure that the model name used in step 2 is the same as the one in config.py (e.g. `model="codellama:7b-instruct"`)\n4. Once the model has finished downloading, you can start asking questions through Continue.',
    icon: "ollama.png",
    tags: [ModelProviderTag["Local"], ModelProviderTag["Open-Source"]],
    packages: [
      {
        ...codeLlamaInstruct,
        refUrl: "https://ollama.ai/library/codellama",
      },
      {
        ...llama2Chat,
        refUrl: "https://ollama.ai/library/llama2",
      },
    ],
    collectInputFor: [...completionParamsInputs],
  },
  together: {
    title: "TogetherAI",
    class: "TogetherLLM",
    description:
      "Use the TogetherAI API for extremely fast streaming of open-source models",
    icon: "together.png",
    longDescription: `Together is a hosted service that provides extremely fast streaming of open-source language models. To get started with Together:\n1. Obtain an API key from [here](https://together.ai)\n2. Paste below\n3. Select a model preset`,
    tags: [
      ModelProviderTag["Requires API Key"],
      ModelProviderTag["Open-Source"],
    ],
    params: {
      api_key: "",
    },
    collectInputFor: [
      {
        inputType: CollectInputType.text,
        key: "api_key",
        label: "API Key",
        placeholder: "Enter your TogetherAI API key",
        required: true,
      },
      ...completionParamsInputs,
    ],
    packages: [
      updatedObj(llama2Chat, {
        "dimensions[0].options": (options: any) =>
          _.mapValues(options, (option) => {
            return _.assign({}, option, {
              model: option.model
                .replace("llama2", "llama-2")
                .replace(":", "-"),
            });
          }),
      }),
      updatedObj(codeLlamaInstruct, {
        "dimensions[0].options": (options: any) =>
          _.mapValues(options, (option) => {
            return _.assign({}, option, {
              model: option.model
                .replace("codellama", "CodeLlama")
                .replace(":", "-")
                .replace("instruct", "Instruct"),
            });
          }),
      }),
    ].map((p) => {
      p.params.context_length = 4096;
      return p;
    }),
  },
  lmstudio: {
    title: "LM Studio",
    class: "GGML",
    description:
      "One of the fastest ways to get started with local models on Mac or Windows",
    longDescription:
      "LMStudio provides a professional and well-designed GUI for exploring, configuring, and serving LLMs. It is available on both Mac and Windows. To get started:\n1. Download from [lmstudio.ai](https://lmstudio.ai/) and open the application\n2. Search for and download the desired model from the home screen of LMStudio.\n3. In the left-bar, click the '<->' icon to open the Local Inference Server and press 'Start Server'.\n4. Once your model is loaded and the server has started, you can begin using Continue.",
    icon: "lmstudio.png",
    tags: [ModelProviderTag["Local"], ModelProviderTag["Open-Source"]],
    params: {
      server_url: "http://localhost:1234",
    },
    packages: [codeLlamaInstruct, llama2Chat],
    collectInputFor: [...completionParamsInputs],
  },
  replicate: {
    title: "Replicate",
    class: "ReplicateLLM",
    description: "Use the Replicate API to run open-source models",
    longDescription: `Replicate is a hosted service that makes it easy to run ML models. To get started with Replicate:\n1. Obtain an API key from [here](https://replicate.com)\n2. Paste below\n3. Select a model preset`,
    params: {
      api_key: "",
    },
    collectInputFor: [
      {
        inputType: CollectInputType.text,
        key: "api_key",
        label: "API Key",
        placeholder: "Enter your Replicate API key",
        required: true,
      },
      ...completionParamsInputs,
    ],
    icon: "replicate.png",
    tags: [
      ModelProviderTag["Requires API Key"],
      ModelProviderTag["Open-Source"],
    ],
    packages: [codeLlamaInstruct, llama2Chat].map((p) => {
      return {
        ...p,
        params: {
          ...p.params,
          model:
            "meta/" +
            p.params.model.replace(":", "-").replace("llama2", "llama-2"),
        },
      };
    }),
  },
  llamacpp: {
    title: "llama.cpp",
    class: "LlamaCpp",
    description: "If you are running the llama.cpp server from source",
    longDescription: `llama.cpp comes with a [built-in server](https://github.com/ggerganov/llama.cpp/tree/master/examples/server#llamacppexampleserver) that can be run from source. To do this:
    
1. Clone the repository with \`git clone https://github.com/ggerganov/llama.cpp\`.
2. \`cd llama.cpp\`
3. Download the model you'd like to use and place it in the \`llama.cpp/models\` directory (the best place to find models is [The Bloke on HuggingFace](https://huggingface.co/TheBloke))
4. Run the llama.cpp server with the command below (replacing with the model you downloaded):

\`\`\`shell
.\\server.exe -c 4096 --host 0.0.0.0 -t 16 --mlock -m models/codellama-7b-instruct.Q8_0.gguf
\`\`\`

After it's up and running, you can start using Continue.`,
    icon: "llamacpp.png",
    tags: [ModelProviderTag.Local, ModelProviderTag["Open-Source"]],
    packages: [codeLlamaInstruct, llama2Chat],
    collectInputFor: [...completionParamsInputs],
  },
  palm: {
    title: "Google PaLM API",
    class: "GooglePaLMAPI",
    description:
      "Try out the Google PaLM API, which is currently in public preview, using an API key from Google Makersuite",
    longDescription: `To get started with Google Makersuite, obtain your API key from [here](https://developers.generativeai.google/products/makersuite) and paste it below.
> Note: Google's PaLM language models do not support streaming, so the response will appear all at once after a few seconds.`,
    icon: "google-palm.png",
    tags: [ModelProviderTag["Requires API Key"]],
    collectInputFor: [
      {
        inputType: CollectInputType.text,
        key: "api_key",
        label: "API Key",
        placeholder: "Enter your MakerSpace API key",
        required: true,
      },
    ],
    packages: [
      {
        title: "chat-bison-001",
        description:
          "Google PaLM's chat-bison-001 model, fine-tuned for chatting about code",
        params: {
          model: "chat-bison-001",
          context_length: 8000,
        },
      },
    ],
  },
  hftgi: {
    title: "HuggingFace TGI",
    class: "HuggingFaceTGI",
    description:
      "HuggingFace Text Generation Inference is an advanced, highly-performant option for serving open-source models to multiple people",
    longDescription:
      "HuggingFace Text Generation Inference is an advanced, highly-performant option for serving open-source models to multiple people. To get started, follow the [Quick Tour](https://huggingface.co/docs/text-generation-inference/quicktour) on their website to set up the Docker container. Make sure to enter the server URL below that corresponds to the host and port you set up for the Docker container.",
    icon: "hf.png",
    tags: [ModelProviderTag.Local, ModelProviderTag["Open-Source"]],
    packages: [codeLlamaInstruct, llama2Chat],
    collectInputFor: [
      ...completionParamsInputs,
      { ...serverUrlInput, defaultValue: "http://localhost:8080" },
    ],
  },
  ggml: {
    title: "Other OpenAI-compatible API",
    class: "GGML",
    description:
      "If you are using any other OpenAI-compatible API, for example text-gen-webui, FastChat, LocalAI, or llama-cpp-python, you can simply enter your server URL",
    longDescription: `If you are using any other OpenAI-compatible API, you can simply enter your server URL. If you still need to set up your model server, you can follow a guide below:

- [text-gen-webui](https://github.com/oobabooga/text-generation-webui/tree/main/extensions/openai#setup--installation)
- [LocalAI](https://localai.io/basics/getting_started/)
- [llama-cpp-python](https://github.com/continuedev/ggml-server-example)
- [FastChat](https://github.com/lm-sys/FastChat/blob/main/docs/openai_api.md)`,
    params: {
      server_url: "",
    },
    collectInputFor: [
      {
        ...serverUrlInput,
        defaultValue: "http://localhost:8000",
      },
      ...completionParamsInputs,
    ],
    icon: "openai.svg",
    tags: [ModelProviderTag.Local, ModelProviderTag["Open-Source"]],
    packages: [codeLlamaInstruct, llama2Chat],
  },
  freetrial: {
    title: "GPT-4 limited free trial",
    class: "OpenAIFreeTrial",
    description:
      "New users can try out Continue for free using a proxy server that securely makes calls to OpenAI using our API key",
    longDescription:
      'New users can try out Continue for free using a proxy server that securely makes calls to OpenAI using our API key. If you are ready to use your own API key or have used all 250 free uses, you can enter your API key in config.py where it says `api_key=""` or select another model provider.',
    icon: "openai.svg",
    tags: [ModelProviderTag.Free],
    packages: [gpt4, gpt35turbo],
    collectInputFor: [...completionParamsInputs],
  },
};