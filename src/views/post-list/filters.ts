import {Post} from "~/common/post";
import {PostFilter} from "./Sidebar";

export type NsfwFilter = NsfwOnlyFilter | NsfwDisabledFilter | UnFiltered<NsfwOnlyFilter>;
export type ScoreFilter = GreaterThanScoreFilter | LessThanScoreFilter | UnFiltered<GreaterThanScoreFilter>;

export class NsfwOnlyFilter implements ToggleFilter {
    checked = true;
    indeterminate = false;
    filter = (post: Post) => post.inner.over_18;
    toggle = () => new NsfwDisabledFilter;
}

export class NsfwDisabledFilter implements ToggleFilter {
    checked = false;
    indeterminate = false;
    filter = (post: Post) => !post.inner.over_18;
    toggle = () => new UnFiltered(NsfwOnlyFilter);
}

export class GScoreFilter implements Filter {
    score: number;

    constructor(score: number) {
        this.score = score
    }

    filter: (post: Post) => boolean;
    toggle = () => undefined;
}

export class GreaterThanScoreFilter extends GScoreFilter {
    filter = (post: Post) => post.inner.score > this.score;
}

export class LessThanScoreFilter extends GScoreFilter {
    filter = (post: Post) => post.inner.score < this.score;
}

export interface Filters {
    nsfw: NsfwFilter;
    greater_than_score?: GreaterThanScoreFilter;
    less_than_score?: LessThanScoreFilter;
    //TODO Content type
}
export interface Filter {
    filter: (post: Post) => boolean;
}

export interface ToggleFilter extends Filter {
    filter: (post: Post) => boolean;
    toggle: () => Filter;
    checked: boolean;
    indeterminate: boolean;
}

export class UnFiltered<T extends Filter> implements ToggleFilter {
    otherConstructor: {new(): T;}

    constructor(type: {new(): T;}) {
        this.otherConstructor = type;
    }
    checked = false;
    indeterminate = true;

    filter = () => true;
    toggle = () => new this.otherConstructor();
}


export const defaultFilters: Filters = {
    nsfw: new NsfwDisabledFilter
}


export const getFilters = (filters: Filters): PostFilter[] => {
    const pFilters: PostFilter[] = [];

    Object.keys(filters).forEach((key: keyof Filters) => {
        const filter = filters[key];
        if (filter) {
            pFilters.push(filter.filter)
        }
    })

    return pFilters;
}
