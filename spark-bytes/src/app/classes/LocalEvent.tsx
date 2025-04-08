interface LocalEvent {
    // description is the description of the event
    description: string;

    // end is the end date and time of the event
    end: Date;

    // food_provider is an array of food providers for the event
    food_provider: string[];

    // food_type is an array of food types for the event
    food_type: string[];

    // area is the area of campus for the event, e.g. east, west, fenway
    area: string;

    // location is the specific location of the event
    location: string;

    // date is the day of the event
    date: Date;

    // start is the start date and time of the event
    start: Date;

    // title is the title of the event
    title: string;

    // user is the uid of the user who created the event
    user: string;

    // id is the id of the event
    id?: string;

    // created_at is the date and time when the event was created
    created_at?: Date;

    //last_updated_by is the uid of the user who last updated the event
    last_updated_by?: string;

    // last_updated_at is the date and time when the event was last updated
    last_updated_at?: Date;

    // followers is an array of uids of users who are following the event, receiving notifications
    followers?: string[];
}

export default LocalEvent;  // Export the LocalEvent interface