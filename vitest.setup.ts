import { afterEach } from "vitest";
import { cleanup } from "@testing-library/react";
//adds DOM checks like toBeInTheDocument() to expect()
import "@testing-library/jest-dom/vitest";

//removes the rendered component after each test, so tests do not see each other
afterEach(cleanup);
