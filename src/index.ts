import { TotoAPIController } from "toto-api-controller";
import { ControllerConfig } from "./Config.js";
import { PostPrompt } from "./dlg/PostPrompt.js";
import { GetSupportedLLMs } from "./dlg/GetSupportedLLMs.js";

const api = new TotoAPIController("toto-ms-llm", new ControllerConfig())

api.path('POST', '/prompts', new PostPrompt())

api.path('GET', '/supportedllms', new GetSupportedLLMs())

api.init().then(() => {
    api.listen()
});