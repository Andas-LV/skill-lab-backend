import {WordResponse} from "@/types/Word";

export const transformWordData = (word: any): WordResponse => ({
    id: word.id,
    english: word.english,
    spanish: word.spanish,
    processed: word.processedByUsers.length > 0,
    learned: word.learnedByUsers.length > 0,
});

export const getWordRelationsInclude = (userId: number) => ({
    processedByUsers: {
        where: { id: userId },
        select: { id: true },
    },
    learnedByUsers: {
        where: { id: userId },
        select: { id: true },
    },
});
