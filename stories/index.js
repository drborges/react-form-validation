import React from "react";
import { storiesOf } from "@storybook/react";
import { action } from "@storybook/addon-actions";
import { linkTo } from "@storybook/addon-links";

import Validation from "../src/Validation";

import styles from "./styles.scss";

const html5RequiredInput = () => (
  <Validation onSuccess={action("Valid!")} onFailure={(e) => action(e.target.validationMessage)(e)}>
    <label htmlFor="username">* Username: </label>
    <input id="username" type="text" required />
  </Validation>
);

const html5RequiredInputCheckbox = () => (
  <Validation onSuccess={action("Valid!")} onFailure={(e) => action(e.target.validationMessage)(e)}>
    <label htmlFor="username">* Username: </label>
    <input type="checkbox" name="username" value="1" required />drborges
    <input type="checkbox" name="username" value="2" required />diego
    <input type="checkbox" name="username" value="3" required />borges
  </Validation>
);

const html5RequiredInputRadio = () => (
  <Validation onSuccess={action("Valid!")} onFailure={(e) => action(e.target.validationMessage)(e)}>
    <label htmlFor="username">* Username: </label>
    <input type="radio" name="username" value="1" required />drborges
    <input type="radio" name="username" value="2" required />diego
    <input type="radio" name="username" value="3" required />borges
  </Validation>
);

const html5RequiredSelect = () => (
  <Validation onSuccess={action("Valid!")} onFailure={(e) => action(e.target.validationMessage)(e)}>
    <label htmlFor="username">* Username: </label>
    <select required>
      <option />
      <option value="1">drborges</option>
      <option value="2">diego</option>
      <option value="3">borges</option>
    </select>
  </Validation>
);

const html5RequiredTextarea = () => (
  <Validation onSuccess={action("Valid!")} onFailure={(e) => action(e.target.validationMessage)(e)}>
    <label htmlFor="username">* Username: </label>
    <textarea required />
  </Validation>
);

const html5EmailInput = () => (
  <Validation onSuccess={action("Valid!")} onFailure={(e) => action(e.target.validationMessage)(e)}>
    <label htmlFor="email">Email: </label>
    <input id="email" type="email" />
  </Validation>
);

const html5URLInput = () => (
  <Validation onSuccess={action("Valid!")} onFailure={(e) => action(e.target.validationMessage)(e)}>
    <label htmlFor="website">Website: </label>
    <input id="website" type="url" />
  </Validation>
);

const html5NumberInput = () => (
  <Validation onSuccess={action("Valid!")} onFailure={(e) => action(e.target.validationMessage)(e)}>
    <label htmlFor="age">Age (between 18 and 40): </label>
    <input id="age" type="number" min="18" max="40" step="1" />
  </Validation>
);

const html5InputPattern = () => (
  <Validation onSuccess={action("Valid!")} onFailure={(e) => action(e.target.validationMessage)(e)}>
    <label htmlFor="phone">Cell: </label>
    <input id="phone" type="text" pattern="\(\d\d\d\) \d\d\d-\d\d\d\d" placeholder="(ddd) ddd-dddd" />
  </Validation>
);

const throttleValidationBy = (delay) => (
  <Validation onSuccess={action("Valid!")} onFailure={(e) => action(e.target.validationMessage)(e)} throttle={delay}>
    <label htmlFor="username">* Username: </label>
    <input id="username" type="text" minLength={3} maxLength={10} />
  </Validation>
);

const nonZeroAndEvenInput = () => {
  const nonZeroNumber = (event) => new Promise((resolve, reject) =>
    (event.target.value != 0) ?
      resolve(event) :
      reject("Cannot be zero!")
  );

  const evenNumber = (event) => new Promise((resolve, reject) =>
    (event.target.value % 2 == 0) ?
      resolve(event) :
      reject("Must be an even number!")
  );

  return (
    <Validation rules={[ nonZeroNumber, evenNumber ]} onSuccess={action("Valid!")} onFailure={(e) => action(e.target.validationMessage)(e)}>
      <label htmlFor="nonzero-even">Non-zero and even: </label>
      <input id="nonzero-even" type="number" />
    </Validation>
  );
};

const githubUsernameInput = () => {
  const githubUsernameExists = (event) => new Promise(async (resolve, reject) => {
    const response = await fetch(`https://api.github.com/users/${event.target.value}`);
    response.ok ?
      resolve(event) :
      reject(`Username '${event.target.value}' does not exist!`);
  });

  return (
    <Validation rules={[ githubUsernameExists ]} throttle={700} onSuccess={action("Valid!")} onFailure={(e) => action(e.target.validationMessage)(e)}>
      <label htmlFor="gh-username">Github Username: </label>
      <input id="gh-username" type="text" required />
    </Validation>
  );
};

const formWithControlledState = () => {
  const validIf = (predicate) => (value) => new Promise((resolve, reject) => {
    predicate(value) ?
      resolve(value) :
      reject(`Value '${value}' does not match predicate!`);
  });

  class Form extends React.Component {
    state = {
      password: "pass123",
      passwordConfirmation: "pass123",
    }

    inputRefs = {
      passwordInput: null,
      passwordConfirmation: null,
    }

    handleChange = (event) => {
      this.setState({
        [event.target.name]: event.target.type === "checkbox" ? event.target.checked : event.target.value,
      })
    }

    render() {
      return (
        <form>
          <Validation
              inputRef={input => this.inputRefs.passwordInput = input}
              onFinish={() => this.inputRefs.passwordConfirmation.validate()}
            >
            <input name="password" value={this.state.password} onChange={this.handleChange} required />
          </Validation>

          <Validation
              inputRef={input => this.inputRefs.passwordConfirmation = input}
              rules={[ validIf(value => value === this.state.password) ]}
          >
            <input name="passwordConfirmation" value={this.state.passwordConfirmation} onChange={this.handleChange} />
          </Validation>

          <div className="row">
            <button type="submit">Submit</button>
          </div>
        </form>
      )
    }
  }

  return (
    <Form />
  );
};
//
// storiesOf("Validation/HTML5", module)
//   .add("required", () => html5RequiredInput())
//   .add("email", () => html5EmailInput())
//   .add("url", () => html5URLInput())
//   .add("number", () => html5NumberInput())
//   .add("input pattern", () => html5InputPattern());
//
// storiesOf("Validation/Custom", module)
//   .add("with multiple rules", () => nonZeroAndEvenInput())
//   .add("Github API validation", () => githubUsernameInput());
//
// storiesOf("Validation/Supported Fields", module)
//   .add("input", () => html5RequiredInput())
//   .add("checkbox", () => html5RequiredInputCheckbox())
//   .add("radio", () => html5RequiredInputRadio())
//   .add("select", () => html5RequiredSelect())
//   .add("textarea", () => html5RequiredTextarea());
//
// storiesOf("Validation/Throtteled", module)
//   .add("by 100ms", () => throttleValidationBy(100))
//   .add("by 500ms", () => throttleValidationBy(500))
//   .add("by 1s", () => throttleValidationBy(1000));

storiesOf("Validation/Use Cases", module)
  .add("Password Confirmation", () => formWithControlledState());