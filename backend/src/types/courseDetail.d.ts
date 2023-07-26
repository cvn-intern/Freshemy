export type CourseDetail = {
    id: number;
    slug: string;
    title: string;
    categories: Category[];
    summary: string;
    author: Author;
    ratings: number;
    thumbnail: string;
    description: string;
    sections: Section[];
    created_at: Date;
    updated_at: Date;
    status: boolean;
};

export type CourseEdit = {
    id: number;
    slug: string;
    title: string;
    categories: Category[];
    summary: string;
    thumbnail: string;
    description: string;
    created_at: Date;
    updated_at: Date;
    status: boolean;
};

export type Category = {
    id: number;
    title?: string;
};
export type Author = {
    first_name: string;
    last_name: string;
    id: number;
};
export type Lesson = {
    id: number;
    title: string;
    url_video: string;
};
export type Section = {
    title: string;
    updated_at: Date;
    id: number;
    lessons: Lesson[];
};

export type OutstandingCourse = {
    id: number;
    thumbnail: string;
    title: string;
    slug: string;
    categories: Category[];
    author: string;
    created_at: Date;
    updated_at: Date;
};
