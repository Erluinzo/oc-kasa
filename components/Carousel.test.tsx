import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import Carousel from "./Carousel";

const pictures = ["/photo-1.jpg", "/photo-2.jpg", "/photo-3.jpg", "/photo-4.jpg", "/photo-5.jpg"];

//hidden photos are aria-hidden, so getByRole("img") only finds the photo that is shown
const shownPhoto = () => screen.getByRole("img").getAttribute("alt");

describe("Carousel", () => {
  it("shows the first photo and the counter 1/5", () => {
    render(<Carousel pictures={pictures} title="Loft" />);
    expect(shownPhoto()).toBe("Loft, photo 1");
    expect(screen.getByText("1/5")).toBeInTheDocument();
    expect(screen.getByText("Photo 1 sur 5")).toBeInTheDocument();
  });

  it("shows the next photo with the next arrow", async () => {
    render(<Carousel pictures={pictures} title="Loft" />);
    await userEvent.click(screen.getByRole("button", { name: "Photo suivante" }));
    expect(shownPhoto()).toBe("Loft, photo 2");
    expect(screen.getByText("2/5")).toBeInTheDocument();
  });

  it("goes from the first photo to the last one with the previous arrow", async () => {
    render(<Carousel pictures={pictures} title="Loft" />);
    await userEvent.click(screen.getByRole("button", { name: "Photo précédente" }));
    expect(shownPhoto()).toBe("Loft, photo 5");
    expect(screen.getByText("5/5")).toBeInTheDocument();
  });

  it("goes from the last photo back to the first one with the next arrow", async () => {
    render(<Carousel pictures={pictures} title="Loft" />);
    const next = screen.getByRole("button", { name: "Photo suivante" });
    for (let i = 0; i < 5; i++) await userEvent.click(next);
    expect(shownPhoto()).toBe("Loft, photo 1");
  });

  it("shows the photo of the small photo that is clicked", async () => {
    render(<Carousel pictures={pictures} title="Loft" />);
    const thumb = screen.getByRole("button", { name: "Voir la photo 4" });
    await userEvent.click(thumb);
    expect(shownPhoto()).toBe("Loft, photo 4");
    expect(thumb).toHaveAttribute("aria-current", "true");
  });

  it("works with the keyboard", async () => {
    render(<Carousel pictures={pictures} title="Loft" />);
    //Tab goes to the first button (previous arrow), Enter clicks it
    await userEvent.tab();
    expect(screen.getByRole("button", { name: "Photo précédente" })).toHaveFocus();
    await userEvent.keyboard("{Enter}");
    expect(shownPhoto()).toBe("Loft, photo 5");
    //arrow keys inside the carousel, with the loop
    await userEvent.keyboard("{ArrowRight}");
    expect(shownPhoto()).toBe("Loft, photo 1");
    await userEvent.keyboard("{ArrowRight}");
    expect(shownPhoto()).toBe("Loft, photo 2");
    await userEvent.keyboard("{ArrowLeft}");
    expect(shownPhoto()).toBe("Loft, photo 1");
  });

  it("shows at most 4 small photos", () => {
    render(<Carousel pictures={[...pictures, "/photo-6.jpg"]} title="Loft" />);
    expect(screen.getAllByRole("button", { name: /^Voir la photo/ })).toHaveLength(4);
  });

  it("has no arrows, no counter and no small photos with one photo", () => {
    render(<Carousel pictures={["/photo-1.jpg"]} title="Loft" />);
    expect(shownPhoto()).toBe("Loft, photo 1");
    expect(screen.queryAllByRole("button")).toHaveLength(0);
    expect(screen.queryByText("1/1")).not.toBeInTheDocument();
  });
});
