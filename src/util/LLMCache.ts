
// Cache of failed LLMs
// This is used to track LLMs that are not working properly, so that they can skip this LLM in future invocations
// The cache is persisted across invocations, so that we can skip the same LLM in future invocations

import { LLM } from "../llm/LLMInterface.js";

// The cache tracks at what time the LLM was last used and has an eviction time of 15 minutes
type FailedLLMCacheEntry = {
    timestamp: number;
};

export const FAILED_LLM_CACHE: Map<string, FailedLLMCacheEntry> = new Map();
const CACHE_EVICTION_MS = 15 * 60 * 1000; // 15 minutes

export function isLLMFailed(llm: LLM): boolean {
    
    const entry = FAILED_LLM_CACHE.get(llm.name);
    
    if (!entry) return false;

    // Evict if expired
    if (Date.now() - entry.timestamp > CACHE_EVICTION_MS) {
        FAILED_LLM_CACHE.delete(llm.name);
        return false;
    }

    return true;
}
