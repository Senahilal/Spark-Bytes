interface LocalEvent {
    // description is the description of the event
    description: string;

    // end is the end date and time of the event
    end: Date;

    // food_provider is an array of food providers for the event
    food_provider: string[];

    // food_type is an array of food types for the event
    food_type: string[];

    // location is the location of the event
    location: string;

    // organizer is the organizer of the event
    organizer: string;

    // start is the start date and time of the event
    start: Date;

    // title is the title of the event
    title: string;

    // user is the uid of the user who created the event
    user: string;

    // id is the id of the event
    id?: string;

    // createdAt is the date and time when the event was created
    createdAt?: Date;
}

export default LocalEvent;  // Export the LocalEvent interface