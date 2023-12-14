// Keeping all of the labels, help texts, error messages, and default values in one place makes keeps main.ts cleaner and makes them easier to change.
// It also opens up the possibility of internationalization in the future.

export const LABELS = {
    MHS_FEEDBACK: "MHS Feedback",
    MHS_API_KEY: "MHS API Key",
    MHS_MIN_CONFIDENCE: "Minimum Confidence",
    MHS_TARGETS: "Checked Content Types",
    MHS_CHECK_EDITS: "Recheck Edits",
};

export const HELP_TEXTS = {
    MHS_FEEDBACK: "Report this content as a false positive or a false negative to ModerateHatespeech.com",
    MHS_API_KEY: "Your API key from ModerateHatespeech.com",
    MHS_MIN_CONFIDENCE: "The minimum confidence level for a comment to be automatically reported. Values below 90% are not recommended.",
    MHS_TARGETS: "The content types that will be checked for hate speech.",
    MHS_CHECK_EDITS: "This determines whether edits will cause the content to be rechecked.",
};

export const ERRORS = {
    INVALID_PRECENTAGE: "Percentage must be a number between 0 and 100!",
};

export const DEFAULTS = {
    MHS_MIN_CONFIDENCE: 90,
    MHS_CHECK_EDITS: true,
    MHS_TARGETS: ["postTitle", "postBody", "comment"],
};

export const OPTIONS = {
    MHS_TARGETS: [
        {
            label: "Post Titles",
            value: "postTitle",
        },
        {
            label: "Post Bodies",
            value: "postBody",
        },
        {
            label: "Comments",
            value: "comment",
        },
    ],
};
