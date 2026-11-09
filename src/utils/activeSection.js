export function getActiveSection(sections, activationLine, atBottom = false) {
  if (atBottom && sections.length) return sections[sections.length - 1].id;
  let active = '';
  for (const section of sections) {
    if (section.top <= activationLine) active = section.id;
  }
  return active;
}
