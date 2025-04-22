import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import "@testing-library/jest-dom";
import CreateEventPage from "./page";
import { useAuthState } from "react-firebase-hooks/auth";
import { useRouter } from "next/navigation";
import { createEvent } from "@/app/firebase/repository";

//Copilot assisted

// Mock dependencies
jest.mock("react-firebase-hooks/auth", () => ({
  useAuthState: jest.fn(),
}));
jest.mock("next/navigation", () => ({
  useRouter: jest.fn(),
}));
jest.mock("@/app/firebase/repository", () => ({
  createEvent: jest.fn(),
}));

describe("CreateEventPage", () => {
  const mockPush = jest.fn();

  beforeEach(() => {
    (useAuthState as jest.Mock).mockReturnValue([{ uid: "test-user-id" }, false]);
    (useRouter as jest.Mock).mockReturnValue({ push: mockPush });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("renders the form correctly", () => {
    render(<CreateEventPage />);

    // Check if the form fields are rendered
    expect(screen.getByPlaceholderText("Enter event title")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Enter description")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Enter event location")).toBeInTheDocument();
    expect(screen.getByText("POST EVENT")).toBeInTheDocument();
  });

  it("allows the user to fill out the form", async () => {
    render(<CreateEventPage />);

    // Fill out the form
    userEvent.type(screen.getByPlaceholderText("Enter event title"), "Test Event");
    userEvent.type(screen.getByPlaceholderText("Enter description"), "This is a test event.");
    userEvent.type(screen.getByPlaceholderText("Enter event location"), "Test Location");

    // Select a campus
    fireEvent.mouseDown(screen.getByText("Select a campus"));
    fireEvent.click(screen.getByText("West Campus"));

    // Add a food provider
    userEvent.type(screen.getByPlaceholderText("Enter provider and press Enter"), "Test Provider");
    fireEvent.click(screen.getByText("Add"));

    // Assert that the form fields are updated
    expect(screen.getByDisplayValue("Test Event")).toBeInTheDocument();
    expect(screen.getByDisplayValue("This is a test event.")).toBeInTheDocument();
    expect(screen.getByDisplayValue("Test Location")).toBeInTheDocument();
    expect(screen.getByText("Test Provider")).toBeInTheDocument();
  });

  it("submits the form and calls createEvent", async () => {
    (createEvent as jest.Mock).mockResolvedValueOnce({});

    render(<CreateEventPage />);

    // Fill out the form
    userEvent.type(screen.getByPlaceholderText("Enter event title"), "Test Event");
    userEvent.type(screen.getByPlaceholderText("Enter description"), "This is a test event.");
    userEvent.type(screen.getByPlaceholderText("Enter event location"), "Test Location");

    // Select a campus
    fireEvent.mouseDown(screen.getByText("Select a campus"));
    fireEvent.click(screen.getByText("West Campus"));

    // Add a food provider
    userEvent.type(screen.getByPlaceholderText("Enter provider and press Enter"), "Test Provider");
    fireEvent.click(screen.getByText("Add"));

    // Submit the form
    fireEvent.click(screen.getByText("POST EVENT"));

    // Wait for the createEvent function to be called
    await waitFor(() => {
      expect(createEvent).toHaveBeenCalledWith(
        expect.objectContaining({
          title: "Test Event",
          description: "This is a test event.",
          location: "Test Location",
          area: "West Campus",
          food_provider: ["Test Provider"],
        })
      );
    });

    // Check if the user is redirected
    expect(mockPush).toHaveBeenCalledWith("/");
  });

  it("redirects to login if the user is not authenticated", () => {
    (useAuthState as jest.Mock).mockReturnValue([null, false]);

    render(<CreateEventPage />);

    expect(mockPush).toHaveBeenCalledWith("/login");
  });
});