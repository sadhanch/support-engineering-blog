function assemble(template, replacements) {

    let output = template;

    for (const [placeholder, content] of Object.entries(replacements)) {

        output = output.replace(
            `{{${placeholder}}}`,
            content
        );

    }

    return output;

}

module.exports = assemble;