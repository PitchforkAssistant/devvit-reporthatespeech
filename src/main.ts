import {Devvit, SettingScope} from "@devvit/public-api";
import {onCommentCreate, onCommentUpdate, onPostCreate, onPostUpdate} from "./handlers/triggers.js";
import {DEFAULTS, HELP_TEXTS, LABELS, OPTIONS} from "./constants.js";
import {validatePrecentage} from "./handlers/validators.js";
// import {mhsFeedbackButton} from "./handlers/menus.js";

Devvit.configure({
    redditAPI: true,
    http: true,
});

// Configuration
Devvit.addSettings([
    {
        type: "string",
        name: "mhsApiKey",
        label: LABELS.MHS_API_KEY,
        helpText: HELP_TEXTS.MHS_API_KEY,
        scope: SettingScope.App,
        isSecret: true,
    },
    {
        type: "number",
        name: "mhsMinConfidence",
        label: LABELS.MHS_MIN_CONFIDENCE,
        helpText: HELP_TEXTS.MHS_MIN_CONFIDENCE,
        scope: SettingScope.Installation,
        defaultValue: DEFAULTS.MHS_MIN_CONFIDENCE,
        onValidate: validatePrecentage,
    },
    {
        type: "select",
        name: "mhsTargets",
        label: LABELS.MHS_TARGETS,
        helpText: HELP_TEXTS.MHS_TARGETS,
        scope: SettingScope.Installation,
        defaultValue: DEFAULTS.MHS_TARGETS,
        options: OPTIONS.MHS_TARGETS,
    },
    {
        type: "boolean",
        name: "mhsCheckEdits",
        label: LABELS.MHS_CHECK_EDITS,
        helpText: HELP_TEXTS.MHS_CHECK_EDITS,
        scope: SettingScope.Installation,
        defaultValue: DEFAULTS.MHS_CHECK_EDITS,
    },
]);

// Post Triggers
Devvit.addTrigger({
    event: "PostCreate",
    onEvent: onPostCreate,
});
Devvit.addTrigger({
    event: "PostUpdate",
    onEvent: onPostUpdate,
});

// Comment Triggers
Devvit.addTrigger({
    event: "CommentCreate",
    onEvent: onCommentCreate,
});
Devvit.addTrigger({
    event: "CommentUpdate",
    onEvent: onCommentUpdate,
});

// TODO: Feedback Buttons
// Devvit.addMenuItem({
//     label: LABELS.MHS_FEEDBACK,
//     description: HELP_TEXTS.MHS_FEEDBACK,
//     location: ["post", "comment"],
//     onPress: mhsFeedbackButton,
// });

export default Devvit;
