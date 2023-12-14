import {
    PostCreate, PostUpdate,
    CommentCreate, CommentUpdate,
} from "@devvit/protos";
import {TriggerContext, OnTriggerEvent} from "@devvit/public-api";
import {ModerateHatespeechClient} from "../mhs.js";
import {cleanUpRedditText} from "../helpers.js";

// Post Triggers
export async function onPostCreate (event: OnTriggerEvent<PostCreate>, context: TriggerContext) {
    const checks = await context.settings.get<string[]>("mhsTargets");
    if (!checks || !(checks.includes("postTitle") || checks.includes("postBody"))) {
        console.log(`Skipping post check, not enabled in settings: ${checks?.toString()}`);
        return;
    }

    const postId = event?.post?.id;
    if (!postId) {
        throw "Skipping post check, no post ID";
    }

    const post = await context.reddit.getPostById(postId);

    const mhsMinConfidence = await context.settings.get<number>("mhsMinConfidence");
    if (mhsMinConfidence === undefined) {
        throw "Skipping comment check, no minimum confidence set";
    }

    const apiKey = await context.settings.get<string>("mhsApiKey");
    if (!apiKey) {
        throw "Skipping comment check, no API key set";
    }

    const mhs = new ModerateHatespeechClient(apiKey);
    if (checks.includes("postTitle")) {
        if (await mhs.isHatespeech(post.title, mhsMinConfidence / 100)) {
            await context.reddit.report(post, {
                reason: "Post title flagged as toxic by MHS model",
            });
        }
    }
    if (checks.includes("postBody")) {
        const cleanedBody = cleanUpRedditText(post.body);
        if (!cleanedBody) {
            console.log("Skipping post body check, no body text");
            return;
        }
        if (await mhs.isHatespeech(cleanedBody, mhsMinConfidence / 100)) {
            await context.reddit.report(post, {
                reason: "Post body flagged as toxic by MHS model",
            });
        }
    }
}

export async function onPostUpdate (event: OnTriggerEvent<PostUpdate>, context: TriggerContext) {
    const checkEdits = await context.settings.get<boolean>("mhsCheckEdits");
    if (checkEdits) {
        await onPostCreate(event, context);
    }
}

// Comment Triggers
export async function onCommentCreate (event: OnTriggerEvent<CommentCreate>, context: TriggerContext) {
    const checks = await context.settings.get<string[]>("mhsTargets");
    if (!checks || !checks.includes("comment")) {
        console.log(`Skipping comment check, not enabled in settings: ${checks?.toString()}`);
        return;
    }

    const commentId = event?.comment?.id;
    if (!commentId) {
        throw "Skipping comment check, no comment ID";
    }

    const comment = await context.reddit.getCommentById(commentId);
    const cleanedBody = cleanUpRedditText(comment.body);
    if (!cleanedBody) {
        console.log("Skipping comment check, no body text");
        return;
    }

    const mhsMinConfidence = await context.settings.get<number>("mhsMinConfidence");
    if (mhsMinConfidence === undefined) {
        throw "Skipping comment check, no minimum confidence set";
    }

    const apiKey = await context.settings.get<string>("mhsApiKey");
    if (!apiKey) {
        throw "Skipping comment check, no API key set";
    }

    const mhs = new ModerateHatespeechClient(apiKey);
    const isHatespeech = await mhs.isHatespeech(cleanedBody, mhsMinConfidence / 100);

    if (isHatespeech) {
        await context.reddit.report(comment, {
            reason: "Comment flagged as toxic by MHS model",
        });
    }
}

export async function onCommentUpdate (event: OnTriggerEvent<CommentUpdate>, context: TriggerContext) {
    const checkEdits = await context.settings.get<boolean>("mhsCheckEdits");
    if (checkEdits) {
        await onCommentCreate(event, context);
    }
}
