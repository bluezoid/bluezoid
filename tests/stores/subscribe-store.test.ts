import { beforeEach, describe, expect, it } from "vitest";
import { useSubscribeStore } from "@/stores/subscribe-store";

describe("useSubscribeStore", () => {
  beforeEach(() => {
    useSubscribeStore.getState().reset();
  });

  it("starts in idle status", () => {
    const s = useSubscribeStore.getState();
    expect(s.status).toBe("idle");
    expect(s.email).toBe("");
  });

  it("updates email and status", () => {
    useSubscribeStore.setState({ email: "x@y.com", status: "loading" });
    expect(useSubscribeStore.getState().email).toBe("x@y.com");
    expect(useSubscribeStore.getState().status).toBe("loading");
  });

  it("reset returns to idle", () => {
    useSubscribeStore.setState({ email: "x@y.com", status: "success", message: "yay" });
    useSubscribeStore.getState().reset();
    const s = useSubscribeStore.getState();
    expect(s.status).toBe("idle");
    expect(s.email).toBe("");
    expect(s.message).toBe("");
  });
});
