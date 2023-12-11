import { type ValidationChecks } from "langium";
import { type PseudanimAstType } from "./generated/ast";
import type { PseudanimServices } from "./pseudanim-module";

/**
 * Register custom validation checks.
 */
export function registerValidationChecks(services: PseudanimServices) {
  const registry = services.validation.ValidationRegistry;
  const validator = services.validation.PseudanimValidator;
  const checks: ValidationChecks<PseudanimAstType> = {};
  registry.register(checks, validator);
}

/**
 * Implementation of custom validations.
 */
export class PseudanimValidator {
  //   checkPersonStartsWithCapital(
  //     person: Person,
  //     accept: ValidationAcceptor
  //   ): void {
  //     if (person.name) {
  //       const firstChar = person.name.substring(0, 1);
  //       if (firstChar.toUpperCase() !== firstChar) {
  //         accept("warning", "Person name should start with a capital.", {
  //           node: person,
  //           property: "name",
  //         });
  //       }
  //     }
  //   }
}
