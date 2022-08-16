import { actionIds, create } from "./context-handlers";

describe("", () => {
  it("", () => {
    const dispatchMock = jest.fn();

    const handler = create()[6];

    const [nextState, changed] = handler(
      {},
      { id: actionIds.ACTION_FETCH_ROUTE_VEHICLES, payload: { routeId: 4 } },
      dispatchMock
    );

    expect(nextState).toEqual(null);
    expect(changed).toBe(null);
  });
});
