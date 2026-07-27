function assemble(template, replacements) {

    let output = template;

    for (const [placeholder, content] of Object.entries(replacements)) {

        output = output.replace(
            `{{${placeholder}}}`,
            content
        );

    }

    const unresolved = output.match(/{{[^}]+}}/g);

    if (unresolved) {

        throw new Error(
            `Unresolved placeholders: ${unresolved.join(", ")}`
        );

    }

    return output;

}

module.exports = assemble;