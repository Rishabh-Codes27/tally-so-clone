import type { ConditionalRule } from "@/components/form-builder/types";

export function evaluateCondition(
  rule: ConditionalRule,
  fieldValue: unknown,
): boolean {
  const value = fieldValue?.toString().toLowerCase() ?? "";
  const ruleValue = rule.value.toLowerCase();

  switch (rule.operator) {
    case "equals":
      return value === ruleValue;
    case "not_equals":
      return value !== ruleValue;
    case "contains":
      return value.includes(ruleValue);
    case "not_contains":
      return !value.includes(ruleValue);
    case "greater_than":
      return Number(value) > Number(ruleValue);
    case "less_than":
      return Number(value) < Number(ruleValue);
    case "greater_or_equal":
      return Number(value) >= Number(ruleValue);
    case "less_or_equal":
      return Number(value) <= Number(ruleValue);
    case "is_empty":
      return value === "" || value === "undefined" || value === "null";
    case "is_not_empty":
      return value !== "" && value !== "undefined" && value !== "null";
    case "starts_with":
      return value.startsWith(ruleValue);
    case "ends_with":
      return value.endsWith(ruleValue);
    default:
      return true;
  }
}

export function shouldShowBlock(
  rules: ConditionalRule[] | undefined,
  answers: Record<string, unknown>,
): boolean {
  if (!rules || rules.length === 0) return true;

  // All rules must pass (AND logic)
  return rules.every((rule) => {
    const fieldValue = answers[rule.fieldId];
    const conditionMet = evaluateCondition(rule, fieldValue);

    // If the action is "show", show when condition is met
    if (rule.action === "show") {
      return conditionMet;
    }
    // If the action is "hide", show when condition is NOT met
    if (rule.action === "hide") {
      return !conditionMet;
    }

    // For require/optional, we don't affect visibility
    return true;
  });
}

export function shouldBeRequired(
  rules: ConditionalRule[] | undefined,
  answers: Record<string, unknown>,
): boolean {
  if (!rules || rules.length === 0) return false;

  // Check if any "require" rule conditions are met
  return rules.some((rule) => {
    if (rule.action !== "require") return false;
    const fieldValue = answers[rule.fieldId];
    return evaluateCondition(rule, fieldValue);
  });
}
