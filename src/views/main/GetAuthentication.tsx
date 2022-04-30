import * as React from 'react';
import Snoowrap from 'snoowrap';
import {Index} from '.';
import {Loading} from './Loading';

export const GetAuthentication = () => {
    const [snoowrap, setSnooWrap] = React.useState<Snoowrap | undefined>();

    React.useEffect(() => {
        const refreshToken = localStorage.getItem("refreshToken");

        if (refreshToken) {
            const r = new Snoowrap({
                refreshToken,
                userAgent: 'Windows:electron-test:0.1.0',
                clientId: 'cy9JcdDLbKkOhtKtgU5yDw',
                clientSecret: '',
            });

            setSnooWrap(r);
        }
        // Just redirected from auth
        else if (window.location.href.includes("code=")) {
            const setWrapper = (s: Snoowrap) => {
                localStorage.setItem('refreshToken', s.refreshToken);
                setSnooWrap(s);
            }

            const params = new URL(window.location.href).searchParams
            const code = params.get("code")!!.replace("#_", "");

            Snoowrap.fromAuthCode({
                code,
                userAgent: 'Windows:electron:0.1.0',
                clientId: 'cy9JcdDLbKkOhtKtgU5yDw',
                // TODO change this to not valid URI
                redirectUri: 'http://snuiredirect.com/',
            }).then(setWrapper);
        } else {
            // Unauthenticated reddit
            Snoowrap.fromApplicationOnlyAuth({
                userAgent: 'Windows:electron-test:0.1.0',
                clientId: 'cy9JcdDLbKkOhtKtgU5yDw',
                clientSecret: "",
                deviceId: 'DO_NOT_TRACK_THIS_DEVICE',
                grantType: 'https://oauth.reddit.com/grants/installed_client',
                permanent: false,
            }).then(setSnooWrap);
        }
    }, [])

    if (snoowrap) {
        return (
            <Index snoowrap={snoowrap} />
        );
    } else {
        return <Loading />
    }

}
