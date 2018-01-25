import * as React from 'react';
import './_midi-error.scss';

interface Props {
    error: Error
}

const MIDIErrorComponent: React.SFC<Props> = function(props) {
    return (
        <div className="midi-error">
            <h3>Error setting up application. Please restart and try again!</h3>
            <p>Most likely you did not approve access to MIDI devices. The error received was: <pre>{props.error.message}</pre></p>
            
        </div>
    );
}

export default MIDIErrorComponent;