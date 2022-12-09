import { Link, useActionData, Form, useTransition as useNavigation, useMatches, useParams} from "@remix-run/react";

function ExpenseForm() {
  const today = new Date().toISOString().slice(0, 10); // yields something like 2023-09-10
  const validationErrors = useActionData();
  const navigation = useNavigation();
  const isSubmitting= navigation.state !== 'idle';
  const matches = useMatches();
  const params = useParams();
  const expenses = matches.find(match => match.id === 'routes/__app/expenses').data;
  const expenseData = expenses.find(expense => expense.id === params.id);

  if (params.id && !expenseData) {
    return <p>Invalid expense id.</p>
  }

  const defaultValues = expenseData ? {
    title: expenseData.title,
    amount: expenseData.amount,
    date: expenseData.date
  } : {
    title: "",
    amount: "",
    date: "",
  }
  
  // const submit = useSubmit();

  // function submitHandler(event) {
  //   event.preventDefault();
  //   //add validation
  //   submit(event.target,
  //     {method: 'post'}
  //   );
  // }

  return (
    <Form
     method={expenseData ? "patch" : "post"} 
     className="form" 
     id="expense-form"
     //onSubmit={submitHandler}
     >
      <p>
        <label htmlFor="title">Expense Title</label>
        <input 
        type="text" 
        id="title" 
        defaultValue={defaultValues.title} 
        name="title" 
        required 
        maxLength={30} />
      </p>

      <div className="form-row">
        <p>
          <label htmlFor="amount">Amount</label>
          <input
            type="number"
            id="amount"
            name="amount"
            defaultValue={defaultValues.amount}
            min="0"
            step="0.01"
            required
          />
        </p>
        <p>
          <label htmlFor="date">Date</label>
          <input 
          type="date" 
          id="date" 
          name="date" 
          max={today} 
          required 
          defaultValue={defaultValues.date ? defaultValues.date.slice(0,10) : ''} 
          />
        </p>
      </div>
      {validationErrors && (
        <ul>
          {Object.values(validationErrors).map((error) => (
            <li key={error}>{error}</li>
          ))}
        </ul>
      )}
      <div className="form-actions">
        <button disabled={isSubmitting}>{isSubmitting ? 'Saving...' : 'Save Expense'}</button>
        <Link to="..">Cancel</Link>
      </div>
    </Form>
  );
}

export default ExpenseForm;
