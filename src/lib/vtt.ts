/**
 * ==========================================================
 * WebVTT Parser
 * ==========================================================
 *
 * Purpose:
 * Parses simple WebVTT caption files into structured cues
 * for rendering and audio/transcript synchronization.
 * ==========================================================
 */

export interface VttCue {

    id?: string;

    start: number;

    end: number;

    text: string;

}


/**
 * Convert a WebVTT timestamp to seconds.
 *
 * Supported formats:
 *
 * HH:MM:SS.mmm
 * MM:SS.mmm
 */
export function parseVttTimestamp(
    value: string
): number {

    const parts =
        value.trim().split(":");


    if (parts.length === 3) {

        const hours =
            Number(parts[0]);

        const minutes =
            Number(parts[1]);

        const seconds =
            Number(parts[2]);

        return (
            hours * 3600 +
            minutes * 60 +
            seconds
        );

    }


    if (parts.length === 2) {

        const minutes =
            Number(parts[0]);

        const seconds =
            Number(parts[1]);

        return (
            minutes * 60 +
            seconds
        );

    }


    throw new Error(
        `Invalid WebVTT timestamp: ${value}`
    );

}


/**
 * Parse WebVTT content.
 */
export function parseVtt(
    source: string
): VttCue[] {

    const normalized =
        source
            .replace(/\r\n/g, "\n")
            .replace(/\r/g, "\n");


    const blocks =
        normalized
            .split(/\n{2,}/)
            .map(
                (block) => block.trim()
            )
            .filter(Boolean);


    const cues: VttCue[] = [];


    for (const block of blocks) {

        if (
            block === "WEBVTT" ||
            block.startsWith("WEBVTT\n")
        ) {

            continue;

        }


        const lines =
            block.split("\n");


        let index =
            0;


        let id: string | undefined;


        if (
            !lines[index]?.includes("-->")
        ) {

            id =
                lines[index]?.trim();

            index += 1;

        }


        const timing =
            lines[index]?.trim();


        if (
            !timing ||
            !timing.includes("-->")
        ) {

            continue;

        }


        const [
            startValue,
            endValueWithSettings
        ] = timing.split("-->");


        const endValue =
            endValueWithSettings
                .trim()
                .split(/\s+/)[0];


        const start =
            parseVttTimestamp(
                startValue
            );


        const end =
            parseVttTimestamp(
                endValue
            );


        const text =
            lines
                .slice(index + 1)
                .join("\n")
                .trim();


        if (!text) {

            continue;

        }


        cues.push({

            ...(id && {
                id
            }),

            start,

            end,

            text

        });

    }


    return cues;

}