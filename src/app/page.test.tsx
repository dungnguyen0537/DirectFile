import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import Home from "./page";

describe("Home", () => {
  it("renders a compact overview panel above the split workspace", () => {
    const { container } = render(<Home />);

    expect(
      screen.getByText("Chuyển MP3 và tải ảnh lấy URL trực tiếp")
    ).toBeInTheDocument();
    expect(container.querySelector(".page-overview-panel")).toBeInTheDocument();
    expect(
      container.querySelector(".workspace-grid.split-workspace.independent-workspace")
    ).toBeInTheDocument();
  });
});
