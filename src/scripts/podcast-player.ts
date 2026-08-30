/**
 * ==========================================================
 * Support Engineering Weekly — Podcast Player
 * ==========================================================
 */

interface PodcastPlayerRoot extends HTMLElement {

    querySelector(
        selectors: string
    ): HTMLElement | null;

    querySelectorAll(
        selectors: string
    ): NodeListOf<HTMLElement>;

}


/* ==========================================================
   Time Formatting
   ========================================================== */

function formatTime(
    seconds: number
): string {

    const safeSeconds =
        Math.max(
            0,
            Math.floor(seconds)
        );


    const hours =
        Math.floor(
            safeSeconds / 3600
        );


    const minutes =
        Math.floor(
            (safeSeconds % 3600) / 60
        );


    const remainingSeconds =
        safeSeconds % 60;


    if (hours > 0) {

        return `${String(hours).padStart(2, "0")}:${String(
            minutes
        ).padStart(2, "0")}:${String(
            remainingSeconds
        ).padStart(2, "0")}`;

    }


    return `${String(minutes).padStart(2, "0")}:${String(
        remainingSeconds
    ).padStart(2, "0")}`;

}


/* ==========================================================
   Player Initialization
   ========================================================== */

function initializePlayer(
    root: PodcastPlayerRoot
): void {

    const audio =
        root.querySelector(
            ".podcast-player__audio"
        ) as HTMLAudioElement | null;


    if (!audio) {

        return;

    }


    /* ======================================================
       Player Controls
       ====================================================== */

    const playButton =
        root.querySelector(
            '[data-action="play"]'
        ) as HTMLButtonElement | null;


    const playIcon =
        root.querySelector(
            "[data-play-icon]"
        );


    const pauseIcon =
        root.querySelector(
            "[data-pause-icon]"
        );


    const currentTime =
        root.querySelector(
            "[data-current-time]"
        );


    const seek =
        root.querySelector(
            '[data-action="seek"]'
        ) as HTMLInputElement | null;


    const currentChapter =
        root.querySelector(
            "[data-current-chapter]"
        );


    const chapterButtons =
        root.querySelectorAll(
            "[data-chapter-start]"
        );


    const speed =
        root.querySelector(
            '[data-action="speed"]'
        ) as HTMLSelectElement | null;


    /* ======================================================
       Transcript
       ====================================================== */

    const transcript =
        document.querySelector(
            "[data-podcast-transcript]"
        );


    const transcriptCues =
        transcript?.querySelectorAll(
            "[data-transcript-cue]"
        ) ?? [];


    const transcriptSeekButtons =
        transcript?.querySelectorAll(
            "[data-transcript-seek]"
        ) ?? [];


    /* ======================================================
       Playing State
       ====================================================== */

    const setPlayingState = (
        playing: boolean
    ): void => {

        if (!playButton) {

            return;

        }


        playButton.setAttribute(
            "aria-label",
            playing
                ? "Pause episode"
                : "Play episode"
        );


        if (playIcon) {

            playIcon.hidden =
                playing;

        }


        if (pauseIcon) {

            pauseIcon.hidden =
                !playing;

        }

    };


    /* ======================================================
       Chapter State
       ====================================================== */

    const updateChapter = (): void => {

        if (
            chapterButtons.length === 0
        ) {

            return;

        }


        const currentTimeValue =
            audio.currentTime;


        let activeIndex =
            0;


        chapterButtons.forEach(
            (button, index) => {

                const start =
                    Number(
                        button.dataset.chapterStart
                    );


                if (
                    start <= currentTimeValue
                ) {

                    activeIndex =
                        index;

                }

            }
        );


        chapterButtons.forEach(
            (button, index) => {

                button.classList.toggle(
                    "is-active",
                    index === activeIndex
                );

            }
        );


        const activeButton =
            chapterButtons[
                activeIndex
            ];


        if (
            activeButton &&
            currentChapter
        ) {

            currentChapter.textContent =
                activeButton
                    .querySelector("strong")
                    ?.textContent
                    ?.trim() ??
                "";

        }

    };


    /* ======================================================
       Transcript State
       ====================================================== */

    const updateTranscript = (): void => {

        if (
            transcriptCues.length === 0
        ) {

            return;

        }


        const current =
            audio.currentTime;


        transcriptCues.forEach(
            (cue) => {

                const start =
                    Number(
                        cue.dataset.transcriptStart
                    );


                const end =
                    Number(
                        cue.dataset.transcriptEnd
                    );


                cue.classList.toggle(
                    "is-active",
                    current >= start &&
                    current < end
                );

            }
        );

    };


    /* ======================================================
       Progress
       ====================================================== */

    const updateProgress = (): void => {

        if (currentTime) {

            currentTime.textContent =
                formatTime(
                    audio.currentTime
                );

        }


        if (seek) {

            seek.value =
                String(
                    audio.currentTime
                );

        }


        updateChapter();

        updateTranscript();

    };


    /* ======================================================
       Play / Pause
       ====================================================== */

    playButton?.addEventListener(
        "click",
        async () => {

            if (audio.ended) {

                audio.currentTime =
                    0;

            }


            if (audio.paused) {

                try {

                    await audio.play();

                }
                catch {

                    return;

                }

            }
            else {

                audio.pause();

            }

        }
    );


    /* ======================================================
       Audio State Events
       ====================================================== */

    audio.addEventListener(
        "play",
        () => {

            setPlayingState(true);

        }
    );


    audio.addEventListener(
        "pause",
        () => {

            setPlayingState(false);

        }
    );


    audio.addEventListener(
        "timeupdate",
        updateProgress
    );


    audio.addEventListener(
        "loadedmetadata",
        () => {

            if (seek) {

                seek.max =
                    String(
                        Number.isFinite(
                            audio.duration
                        )
                            ? audio.duration
                            : Number(
                                seek.max
                            )
                    );

            }


            updateProgress();

        }
    );


    /* ======================================================
       Seek
       ====================================================== */

    seek?.addEventListener(
        "input",
        () => {

            audio.currentTime =
                Number(
                    seek.value
                );

        }
    );


    /* ======================================================
       Skip Backward
       ====================================================== */

    root.querySelector(
        '[data-action="backward"]'
    )?.addEventListener(
        "click",
        () => {

            audio.currentTime =
                Math.max(
                    0,
                    audio.currentTime - 10
                );

        }
    );


    /* ======================================================
       Skip Forward
       ====================================================== */

    root.querySelector(
        '[data-action="forward"]'
    )?.addEventListener(
        "click",
        () => {

            audio.currentTime =
                Math.min(
                    audio.duration || Infinity,
                    audio.currentTime + 30
                );

        }
    );


    /* ======================================================
       Playback Speed
       ====================================================== */

    speed?.addEventListener(
        "change",
        () => {

            audio.playbackRate =
                Number(
                    speed.value
                );

        }
    );


    /* ======================================================
       Chapter Navigation
       ====================================================== */

    chapterButtons.forEach(
        (button) => {

            button.addEventListener(
                "click",
                () => {

                    const start =
                        Number(
                            button.dataset.chapterStart
                        );


                    if (
                        !Number.isFinite(start)
                    ) {

                        return;

                    }


                    audio.currentTime =
                        start;


                    void audio.play();

                }
            );

        }
    );


    /* ======================================================
       Transcript Navigation
       ====================================================== */

    transcriptSeekButtons.forEach(
        (button) => {

            button.addEventListener(
                "click",
                () => {

                    const start =
                        Number(
                            button.dataset.transcriptSeek
                        );


                    if (
                        !Number.isFinite(start)
                    ) {

                        return;

                    }


                    audio.currentTime =
                        start;


                    void audio.play();

                }
            );

        }
    );


    /* ======================================================
       Episode Completion
       ====================================================== */

    audio.addEventListener(
        "ended",
        () => {

            setPlayingState(false);


            if (seek) {

                seek.value =
                    "0";

            }


            transcriptCues.forEach(
                (cue, index) => {

                    cue.classList.toggle(
                        "is-active",
                        index === 0
                    );

                }
            );


            updateProgress();

        }
    );


    /* ======================================================
       Initial State
       ====================================================== */

    updateProgress();

}


/* ==========================================================
   Public Initialization
   ========================================================== */

export function initializePodcastPlayers(): void {

    const players =
        document.querySelectorAll(
            "[data-podcast-player]"
        ) as NodeListOf<PodcastPlayerRoot>;


    players.forEach(
        initializePlayer
    );

}