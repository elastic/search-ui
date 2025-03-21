// setup file
import { configure } from "enzyme";
import util from "util";
import Adapter from "@cfaester/enzyme-adapter-react-18";

configure({ adapter: new Adapter() });

if (typeof global.TextEncoder === "undefined") {
  Object.defineProperty(global, "TextEncoder", {
    value: util.TextEncoder
  });
}

if (typeof global.TextDecoder === "undefined") {
  Object.defineProperty(global, "TextDecoder", {
    value: util.TextDecoder
  });
}
