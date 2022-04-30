import * as React from 'react';
import {useInsertMode, useKeyPress} from '~/common/utils';
import {Popup} from '~/common/components/Popup';
import {defaultFilters, Filters, NsfwFilter, NsfwOnlyFilter, UnFiltered} from '../filters';

export interface FilterProps {
    setFilters: (filters: Filters) => void;
}

export const FiltersUI = (props: FilterProps) => {
    const [show, setShow] = React.useState(false);
    const [filters, setFilters] = React.useState(defaultFilters);
    const nsfwRef = React.useRef<HTMLInputElement>(null);

    React.useEffect(() => {
        if (nsfwRef.current) {
            nsfwRef.current.checked = filters.nsfw.checked;
            nsfwRef.current.indeterminate = filters.nsfw.indeterminate;
            props.setFilters(filters);
        }
    }, [filters])

    const onExit = () => setShow(false);
    const onOpen = () => setShow(true);

    useInsertMode(onExit, onExit, onOpen, 'openFilters')

    return (
        <Popup show={show} >
            <input id='nsfw-filter-box' type="checkbox" ref={nsfwRef} onChange={() => setFilters(old => {
                const n = {
                    ...old
                };

                n.nsfw = n.nsfw.toggle();

                return n;
            })} />
            <label htmlFor='nsfw-filter-box'> NSFW </label>
        </Popup>
    );
}