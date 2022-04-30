import React from "react";
import {useState} from "react"
import {Popup} from "~/common/components/Popup";
import {KeyPress, keyPressToPretty, Mods, useInsertMode} from "~/common/utils";
import {Formik, Form, Field} from 'formik';
import {ActionMap, config} from "~/common/config";
import {ModeContext} from "..";
import {Horizontal} from "~/common/components/Horizontal";

interface FormikValues {
    action: keyof ActionMap;
}

export const KeybindMenu = () => {
    const [show, setShow] = useState(false);
    const [bind, setCBind] = useState<KeyPress | null>(null);

    const onExit = () => setShow(false);
    const onOpen = () => setShow(true);

    useInsertMode(onExit, onExit, onOpen, 'openKeybinds')

    const setBind = (ev: KeyboardEvent) => {
        const mods: Mods[] = [];
        ev.shiftKey && mods.push('SHIFT');
        ev.altKey && mods.push('ALT');
        ev.ctrlKey && mods.push('CTRL');

        if (/^[A-Z0-9]$/i.test(ev.key)) {
            setCBind({targetKey: ev.key.toLowerCase(), modifiers: mods})
            window.removeEventListener('keydown', setBind);
        }
    }

    const recordKeyBind = () => {
        window.addEventListener('keydown', setBind);
    }

    return (
        <Popup show={show} >
            <Formik
                initialValues={{action: 'down'} as FormikValues}
                onSubmit={(values) => {
                    if (bind) {
                        config.setKeybind(values.action, bind);
                    }
                }}
            >
                <Form>
                    <Horizontal>
                        <Field as='select' name="action">
                            {Object.keys(config.defaults.keybinds).map(key => (<option key={key} value={key}>{key}</option>))}
                        </Field>
                        {bind && <div>{keyPressToPretty(bind)}</div>}
                        <button type='button' onClick={recordKeyBind}>Record</button>
                    </Horizontal>
                    <br />
                    <button type="submit">Update</button>
                </Form>
            </Formik>
        </Popup>
    );
    return null;
}