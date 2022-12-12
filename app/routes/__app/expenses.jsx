import { Link, useLoaderData} from "@remix-run/react";
import { Outlet } from "@remix-run/react";
import ExpensesList from "~/components/expenses/ExpensesList";
import { FaPlus, FaDownload } from "react-icons/fa";
import { getExpenses } from "~/data/expenses.server";
import { requireUserSession } from "~/data/auth.server";
import { redirect } from "@remix-run/node";


export default function ExpensesLayout(){
    const expenses = useLoaderData();

    const hasExpenses = expenses && expenses.length > 0;

    return(
        <>
            <Outlet />
            <main>
                <section id="expenses-actions">
                    <span>
                        <Link to="add">
                            <FaPlus />Add a new Expense
                        </Link>
                    </span>
                    <span>
                        <a href="expenses/raw"><FaDownload />Download raw data</a>
                    </span>
                </section>                
                { hasExpenses && <ExpensesList expenses={expenses}/>}
                { !hasExpenses && 
                    <section id="no-expenses">
                        <h1>No Expenses Found</h1>
                        <p>Start <Link to="add" >adding some</Link> today.</p>
                    </section>
                }
            </main>           
       </>
    )
}
export async function loader({request}){

    requireUserSession(request);
    
    const expenses = await getExpenses();
    return expenses;

}
