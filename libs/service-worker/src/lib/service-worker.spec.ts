import { serviceWorker } from "./service-worker";

describe("serviceWorker", () => {
  it("should work", () => {
    expect(serviceWorker()).toEqual("service-worker");
  });
});
