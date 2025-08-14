import { useState } from 'react'

function App() {
    const [count, setCount] = useState(0)

    return (
        <>
            <nav class="bg-gradient-to-r from-zinc-600 to-red-600 py-5 h-50">
                <div class="max-w-7xl mx-auto px-2 sm:px-5 lg:px-5">
                    <div class="flex justify-center h-16">
                        <div class="flex-shrink-0 flex items-center">
                            <h1 className="text-5xl font-bold text-slate-50 ">
                                Numerical Method
                            </h1>
                        </div>
                    </div>
                </div>
            </nav>

            <section class="bg-gray-100 py-5 h-50 ">
                <div class="container mx-auto py-2 h-10">
                    <h2 class="text-2xl font-bold mb-2">สูตรการคำนวณ</h2>
                </div>
            </section>

            <div className='bg bg-linear-gradient(-90deg, puple, black)'>
                <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
                    <div class="flex p-4 mb-4 text-sm text-blue-800 rounded-lg bg-blue-50 dark:bg-gray-200 dark:text-slate-950" role="alert">
                        <span class="sr-only">Info</span>
                        <div>
                            <h5 class="text-2xl font-bold leading-none text-slate-950 dark:text-gray">Root Of Equation </h5>
                            <ul class="list-disc pl-6">
                                <li>
                                    <a href='/graphical' class="text-m font-medium text-gray-900 truncate dark:text-zinc-950">
                                        Graphical Method
                                    </a>
                                </li>
                                <li>
                                    <a href='/bisection' class="text-m font-medium text-gray-900 truncate dark:text-zinc-950">
                                        Bisection Method
                                    </a>
                                </li>
                                <li>
                                    <a href='/falseposition' className="text-m font-medium text-gray-900 truncate dark:text-zinc-950">
                                        False Position Method
                                    </a>
                                </li>
                                <li>
                                    <a href='/onepoint' class="text-m font-medium text-gray-900 truncate dark:text-zinc-950">
                                        One point Iteration Method
                                    </a>
                                </li>
                                <li>
                                    <a href='/newton' class="text-m font-medium text-gray-900 truncate dark:text-zinc-950">
                                        Newton Raphoson Method
                                    </a>
                                </li>
                                <li>
                                    <a href='/secant' class="text-m font-medium text-gray-900 truncate dark:text-zinc-950">
                                        Secant Method
                                    </a>
                                </li>
                                
                            </ul>
                        </div>
                    </div>

                    <div class="flex p-4 mb-4 text-sm text-red-800 rounded-lg bg-red-50 dark:bg-gray-200 dark:text-slate-950" role="alert">
                        <span class="sr-only">Danger</span>
                        <div>
                            <h5 class="text-2xl font-bold leading-none text-gray-900 dark:text-zinc-950">Linear Algebraic Equations</h5>
                            <ul class="list-disc pl-6">
                                <li>
                                    <a href='/cramer' class="text-m font-medium text-gray-900 truncate dark:text-zinc-950">
                                        Cramer's Rule
                                    </a>
                                </li>
                                <li>
                                    <a href='/gausselimination' class="text-m font-medium text-gray-900 truncate dark:text-zinc-950">
                                        Gauss Elimination Method
                                    </a>
                                </li>
                                <li>
                                    <a href='/gaussjordan' class="text-m font-medium text-gray-900 truncate dark:text-zinc-950">
                                        Gauss-Jordan Method
                                    </a>
                                </li>
                                <li>
                                    <a href='/matrix' class="text-m font-medium text-gray-900 truncate dark:text-zinc-950">
                                        Matrix Inversion Method
                                    </a>
                                </li>
                                <li>
                                    <a href='/ludecomposition' class="text-m font-medium text-gray-900 truncate dark:text-zinc-950">
                                        LU Decomposition Method
                                    </a>
                                </li>
                                <li>
                                    <a href='/jacobi' class="text-m font-medium text-gray-900 truncate dark:text-zinc-950">
                                        Jacobi Iteration Method
                                    </a>
                                </li>
                                <li>
                                    <a href='/gaussseidel' class="text-m font-medium text-gray-900 truncate dark:text-zinc-950">
                                        Gauss-Seidel Iteration Method
                                    </a>
                                </li>
                                <li>
                                    <a href='/conjugate' class="text-m font-medium text-gray-900 truncate dark:text-zinc-950">
                                        Conjugate Gradient Method
                                    </a>
                                </li>
                            </ul>
                        </div>
                    </div>

                    <div class="flex p-4 mb-4 text-sm text-blue-800 rounded-lg bg-blue-50 dark:bg-gray-200 dark:text-slate-950" role="alert">
                        <span class="sr-only">Info</span>
                        <div>
                            <h5 class="text-2xl font-bold leading-none text-gray-900 dark:text-zinc-950">Interpolation And Extrapolation</h5>
                            <ul class="list-disc pl-6">
                                <li>
                                    <a href='/newtons' class="text-m font-medium text-gray-900 truncate dark:text-zinc-950">
                                        Newton's Divided-Differences
                                    </a>
                                </li>
                                <li>
                                    <a href='/lagrange' class="text-m font-medium text-gray-900 truncate dark:text-zinc-950">
                                        Lagrange Polynomials
                                    </a>
                                </li>
                                <li>
                                    <a href='/spline' class="text-m font-medium text-gray-900 truncate dark:text-zinc-950">
                                        Spline Interpolation
                                    </a>
                                </li>
                            </ul>
                        </div>
                    </div>

                    <div class="flex p-4 mb-4 text-sm text-blue-800 rounded-lg bg-blue-50 dark:bg-gray-200 dark:text-slate-950" role="alert">
                        <span class="sr-only">Info</span>
                        <div>
                            <h5 class="text-2xl font-bold leading-none text-gray-900 dark:text-zinc-950">Least Squares Regression</h5>
                            <ul class="list-disc pl-6">
                                <li>
                                    <a href='/linear' class="text-m font-medium text-gray-900 truncate dark:text-zinc-950">
                                        Linear Regression
                                    </a>
                                </li>
                                <li>
                                    <a href='/polynomial' class="text-m font-medium text-gray-900 truncate dark:text-zinc-950">
                                        Polynomial Regression
                                    </a>
                                </li>
                                <li>
                                    <a href='/multiple' class="text-m font-medium text-gray-900 truncate dark:text-zinc-950">
                                        Multiple Linear Regression
                                    </a>
                                </li>
                            </ul>
                        </div>
                    </div>

                    <div class="flex p-4 mb-4 text-sm text-blue-800 rounded-lg bg-blue-50 dark:bg-gray-200 dark:text-slate-950" role="alert">
                        <span class="sr-only">Info</span>
                        <div>
                            <h5 class="text-2xl font-bold leading-none text-gray-900 dark:text-zinc-950">Integration</h5>
                            <ul class="list-disc pl-6">
                                <li>
                                    <a href='/trapezoidal' class="text-m font-medium text-gray-900 truncate dark:text-zinc-950">
                                        Trapezoidal Rule
                                    </a>
                                </li>
                                <li>
                                    <a href='/compositetra' class="text-m font-medium text-gray-900 truncate dark:text-zinc-950">
                                        Composite Trapezoidal Rule
                                    </a>
                                </li>
                                <li>
                                    <a href='/simpson' class="text-m font-medium text-gray-900 truncate dark:text-zinc-950">
                                        Simpson's Rule
                                    </a>
                                </li>
                                <li>
                                    <a href='/compositesim' class="text-m font-medium text-gray-900 truncate dark:text-zinc-950">
                                        Composite Simpson's Rule
                                    </a>
                                </li>
                            </ul>
                        </div>
                    </div>

                    <div class="flex p-4 mb-4 text-sm text-blue-800 rounded-lg bg-blue-50 dark:bg-gray-200 dark:text-slate-950" role="alert">
                        <span class="sr-only">Info</span>
                        <div>
                            <h5 class="text-2xl font-bold leading-none text-gray-900 dark:text-zinc-950">Differentiation</h5>
                            <ul class="list-disc pl-6">
                                <li>
                                    <a href='/forward' class="text-m font-medium text-gray-900 truncate dark:text-zinc-950">
                                        Forward Divided-Differences O(h)
                                    </a>
                                </li>
                                <li>
                                    <a href='/forwardoh2' class="text-m font-medium text-gray-900 truncate dark:text-zinc-950">
                                        Forward Divided-Differences O(h^2)
                                    </a>
                                </li>
                                <li>
                                    <a href='/backward' class="text-m font-medium text-gray-900 truncate dark:text-zinc-950">
                                        Backward Divided-Differences O(h)
                                    </a>
                                </li>
                                <li>
                                    <a href='/backwardoh2' class="text-m font-medium text-gray-900 truncate dark:text-zinc-950">
                                        Backward Divided-Differences O(h^2)
                                    </a>
                                </li>
                                <li>
                                    <a href='/central' class="text-m font-medium text-gray-900 truncate dark:text-zinc-950">
                                        Central Divided-Differences O(h^2)
                                    </a>
                                </li>
                                <li>
                                    <a href='/centraloh2' class="text-m font-medium text-gray-900 truncate dark:text-zinc-950">
                                        Central Divided-Differences O(h^4)
                                    </a>
                                </li>
                               
                            </ul>
                        </div>
                    </div>

                </div>
            </div>
        </>
    )
}
export default App