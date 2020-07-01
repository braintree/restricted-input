const ALPHA_REGEX = /[A-Za-z]/;
const DIGIT_REGEX = /\d/;
const WILD_REGEX = /./;
const PLACEHOLDER_REGEX = /^[A-Za-z0-9\*]$/;
const PLACEHOLDER_PATTERN = "({{[^}]+}})";
const PERMACHAR_REGEX = "(\\s|\\S)";
const PATTERN_REGEX = new RegExp(
  PLACEHOLDER_PATTERN + "|" + PERMACHAR_REGEX,
  "g"
);
const PLACEHOLDER_PATTERN_REGEX = new RegExp("^" + PLACEHOLDER_PATTERN + "$");
const replacerRegex = new RegExp("{|}", "g");

export type Pattern = {
  value: RegExp | string;
  isPermaChar: boolean;
  index: number;
};

function isDigit(char: string): boolean {
  return DIGIT_REGEX.test(char);
}

function isAlpha(char: string): boolean {
  return ALPHA_REGEX.test(char);
}

function createRegexForChar(char: string): RegExp {
  if (isDigit(char)) {
    return DIGIT_REGEX;
  } else if (isAlpha(char)) {
    return ALPHA_REGEX;
  }

  return WILD_REGEX;
}

function isPlaceholder(char: string): boolean {
  return PLACEHOLDER_REGEX.test(char);
}

function isPlaceholderPattern(str: string): boolean {
  return PLACEHOLDER_PATTERN_REGEX.test(str);
}

export function parsePattern(patternString: string): Pattern[] {
  const patternArray: Pattern[] = [];
  const patternParts = patternString.match(PATTERN_REGEX);

  if (!patternParts) {
    return patternArray;
  }

  for (let index = 0, i = 0; i < patternParts.length; i++) {
    const patternPart = patternParts[i];

    if (isPlaceholderPattern(patternPart)) {
      const placeholderChars = patternPart.replace(replacerRegex, "").split("");
      for (let j = 0; j < placeholderChars.length; j++) {
        const placeholderChar = placeholderChars[j];

        if (!isPlaceholder(placeholderChar)) {
          throw new Error(
            "Only alphanumeric or wildcard pattern matchers are allowed"
          );
        }

        patternArray.push({
          value: createRegexForChar(placeholderChar),
          isPermaChar: false,
          index: index++,
        });
      }
    } else {
      patternArray.push({
        value: patternPart,
        isPermaChar: true,
        index: index++,
      });
    }
  }

  return patternArray;
}
