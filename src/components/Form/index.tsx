import { useForm, useFieldArray, FieldErrors } from "react-hook-form";
import { DevTool } from "@hookform/devtools";
import { useEffect } from "react";

interface FormData {
  username: string;
  email: string;
  channel: string;
  social: {
    twitter: string;
    facebook: string;
  };
  phoneNumbers: { number: string }[];
  age: number;
  dob: Date;
}

const Form: React.FC = () => {
  const {
    register,
    control,
    handleSubmit,
    formState,
    watch,
    getValues,
    setValue,
    reset,
    trigger
  } = useForm<FormData>({
    defaultValues: {
      username: "narainam",
      phoneNumbers: [{ number: "" }],
    },
    mode: "onBlur",
  });
  const { fields, append, remove } = useFieldArray({
    control,
    name: "phoneNumbers",
  });

  const onSubmitHandler = (formData: FormData) => {
    console.log(formData);
  };

  const getValuesHandler = () => {
    console.log(getValues());
  };

  const setValuesHandler = () => {
    setValue("username", "", {
      shouldDirty: true,
      shouldTouch: true,
      shouldValidate: true,
    });
  };

  const onError = (errors: FieldErrors) => {
    console.log(errors);
  };

  const {
    touchedFields,
    dirtyFields,
    isDirty,
    isValid,
    isSubmitting,
    isSubmitSuccessful,
  } = formState;
  // console.log(touchedFields, dirtyFields, isDirty);

  useEffect(() => {
    const subscription = watch((value) => {
      console.log(value);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [watch]);

  useEffect(() => {
    if (isSubmitSuccessful) {
      reset();
    }
  }, [isSubmitSuccessful, reset]);

  return (
    <>
      <DevTool control={control} placement="top-right" />
      <form onSubmit={handleSubmit(onSubmitHandler, onError)} noValidate>
        <div className="form-control">
          <label htmlFor="username">Username</label>
          <input
            type="text"
            id="username"
            {...register("username", {
              required: {
                value: true,
                message: "username is required",
              },
            })}
          />
          <p className="error">{formState.errors.username?.message}</p>
        </div>

        <div className="form-control">
          <label htmlFor="email">Email</label>
          <input
            type="text"
            id="email"
            {...register("email", {
              required: {
                value: true,
                message: "email is required",
              },
              pattern: {
                value:
                  /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
                message: "invalid email",
              },
              validate: {
                blackListed: (email) =>
                  email !== "damare@gmail.com" || "blacklisted email",
                domain: (email) =>
                  !email.endsWith("@yahoo.com") || "@yahoo.com not allowed",
                isUnique: async (email) => {
                  const response = await fetch(
                    `https://jsonplaceholder.typicode.com/users?email=${email}`
                  );
                  const data = await response.json();
                  return !data.length || "email already exists";
                },
              },
            })}
          />
          <p className="error">{formState.errors.email?.message}</p>
        </div>
        <div className="form-control">
          <label htmlFor="channel">Channel</label>
          <input
            type="text"
            id="channel"
            {...register("channel", {
              required: {
                value: true,
                message: "channel is required",
              },
            })}
          />
          <p className="error">{formState.errors.channel?.message}</p>
        </div>
        <div className="form-control">
          <label htmlFor="twitter">Twitter</label>
          <input
            type="text"
            id="twitter"
            {...register("social.twitter", {
              disabled: watch("channel") === "",
            })}
          />
        </div>
        <div className="form-control">
          <label htmlFor="facebook">Facebook</label>
          <input type="text" id="facebook" {...register("social.facebook")} />
        </div>
        <div>
          <label>List of phone numbers</label>
          {fields.map((field, index) => (
            <div key={field.id} className="form-control">
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                }}
              >
                <input
                  type="text"
                  {...register(`phoneNumbers.${index}.number`)}
                />
                {index > 0 && (
                  <button onClick={() => remove(index)}>remove</button>
                )}
              </div>
            </div>
          ))}
          <button type="button" onClick={() => append({ number: "" })}>
            Add phone number
          </button>
        </div>
        <div className="form-control">
          <label htmlFor="age">age</label>
          <input
            type="number"
            id="age"
            {...register("age", {
              required: {
                value: true,
                message: "age is required",
              },
              valueAsNumber: true,
            })}
          />
          <p className="error">{formState.errors.age?.message}</p>
        </div>
        <div className="form-control">
          <label htmlFor="dob">Date of birth</label>
          <input
            type="date"
            id="dob"
            {...register("dob", {
              required: {
                value: true,
                message: "dob is required",
              },
              valueAsDate: true,
            })}
          />
          <p className="error">{formState.errors.dob?.message}</p>
        </div>
        <button type="button" disabled={isSubmitting} onClick={() => reset()}>
          Reset
        </button>
        <button type="submit" disabled={!isValid || !isDirty || isSubmitting}>
          Submit
        </button>
        <button type="button" onClick={getValuesHandler}>
          Get values
        </button>
        <button type="button" onClick={setValuesHandler}>
          Set values
        </button>
        <button type="button" onClick={() => trigger()}>
          Validate
        </button>
      </form>
    </>
  );
};

export default Form;
