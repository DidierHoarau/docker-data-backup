import * as chai from "chai";
import * as sinon from "sinon";

declare var Promise: any;

export let sandbox: any;

export const doNothing = () => {
  //
};

export const justResolve = () => {
  return Promise.resolve();
};

export const justReject = () => {
  return Promise.reject("stub rejected promise");
};

beforeEach(() => {
  sandbox = sinon.sandbox.create();
});

afterEach(() => {
  sandbox.restore();
});
