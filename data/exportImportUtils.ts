import { BuiltProgramme } from "@/types/types";
import { getBlockOrder } from "./courseUtils";

function exportToLegibleText(programme: BuiltProgramme) {
    let text = `MSc Programme Plan - ${programme.track}\n\n`;

    for (const year in programme.courses) {
        text += `YEAR ${year}\n`
        text += "======\n\n";

        const blocks = programme.courses[year];

        getBlockOrder().forEach(blockId => {
            let sum = 0;
            text += `Block ${blockId.toUpperCase()}:\n`
            if (blocks[blockId].length === 0) {
                text += "  • No courses selected\n"
            } else {
                blocks[blockId].forEach(course => {
                    text += `  • ${course.code} - ${course.name} (${course.credits} ECTS)\n`
                    sum += course.credits;
                })
            }

            text += `  Total: ${sum} ECTS\n\n`
        })
    }

    return text
}

function exportToJson(programme: BuiltProgramme) {
    return JSON.stringify(programme);
}

function downloadFile(textData: string, filename: string, mimeType: string) {
    const blob = new Blob([textData], { type: mimeType })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = filename
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
}


function downloadJsonFile(programme: BuiltProgramme) {
    downloadFile(exportToJson(programme), `msc-programme-${programme.track?.toLowerCase().replace(/\s+/g, "-")}.json`, "application/json")
}

function downloadLegibleText(programme: BuiltProgramme) {
    downloadFile(exportToLegibleText(programme), `msc-programme-${programme.track?.toLowerCase().replace(/\s+/g, "-")}.txt`, "text/plain")
}


export { exportToLegibleText, exportToJson, downloadJsonFile, downloadLegibleText };