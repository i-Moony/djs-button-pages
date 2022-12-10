import { EmbedBuilder } from "discord.js";
import { getEmbedLength } from "../../src/Paginations";

describe("getEmbedLength: function that counts embed's length.", () => {
    test("correctly count embed's length", () => {
        const name = "Sample nickname.",
        description = "Sample description.",
        fieldName = "Sample field.",
        fieldValue = "Sample value.",
        text = "Sample text.",
        title = "Sample title.";

        const embed = new EmbedBuilder()
            .setAuthor({name})
            .setDescription(description)
            .setFields([
                {
                    name: fieldName,
                    value: fieldValue,
                },
            ])
            .setFooter({text})
            .setTitle(title);
    
        expect(getEmbedLength(embed.data)).toBe(name.length + description.length + fieldName.length + fieldValue.length + text.length + title.length);
    });

    test("correctly count empty embed's length", () => {
        const embed = new EmbedBuilder();

        expect(getEmbedLength(embed.data)).toBe(0);
    });
});