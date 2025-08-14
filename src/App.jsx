import { useState } from 'react'
import './App.css'
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Homepage from "./page/home"
import Bisection from "./page/Rootofequation/bisection"
import FalsePosition from "./page/Rootofequation/falseposition"
import Onepoint from "./page/Rootofequation/onepoint"
import Newton from "./page/Rootofequation/newton"
import Secant from "./page/Rootofequation/secant"
import Graphical from "./page/Rootofequation/graphical"

import Forwardtest from "./page/Differentiation/forwardtest"

import Cramersrule from "./page/Linearalgebraic/cramer"
import Gausselimination from "./page/Linearalgebraic/gausselimination"
import Gaussjordan from "./page/Linearalgebraic/gaussjordan"
import Matrix from "./page/Linearalgebraic/matrixinversion"
import Ludecomposition from "./page/Linearalgebraic/lu"
import Gaussseidel from "./page/Linearalgebraic/gaussseidel"
import Jacobi from "./page/Linearalgebraic/jacobi"
import Conjugate from "./page/Linearalgebraic/conjugate"

import Newtons from "./page/Interpolation/newtons"
import Lagrange from "./page/Interpolation/lagrange"
import Spline from "./page/Interpolation/spline"

import Linear from "./page/Least/linear"
import Polynomial from "./page/Least/polynomial"
import Multiple from "./page/Least/multiple"

import Trapezodal from "./page/Integration/trapezoidal"
import Simpson from "./page/Integration/simpson"
import Compositetra from "./page/Integration/compositetra"
import Compositesim from "./page/Integration/compositesim"

import Central from "./page/Differentiation/central"
import Centraloh2 from "./page/Differentiation/centraloh4"
import Backward from "./page/Differentiation/backward"
import Backwardoh2 from "./page/Differentiation/backwardoh2"
import Forward from "./page/Differentiation/forward"
import Forwardoh2 from "./page/Differentiation/forwardoh2"
import Second from "./page/Differentiation/secondforward"


function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path='/second' element={<Second></Second>}></Route>
        <Route path='/forwardtest' element={<Forwardtest></Forwardtest>}>
        </Route>
          <Route path='' element={<Homepage></Homepage>}>
          </Route>
          <Route path='/' element={<Homepage></Homepage>}>
          </Route>
          <Route path='/bisection' element={<Bisection></Bisection>}>
          </Route>
          <Route path='/falseposition' element={<FalsePosition></FalsePosition>}>
          </Route>
          <Route path='/onepoint' element={<Onepoint></Onepoint>}>
          </Route>
          <Route path='/newton' element={<Newton></Newton>}>
          </Route>
          <Route path='/secant' element={<Secant></Secant>}>
          </Route>
          <Route path='/graphical' element={<Graphical></Graphical>}>
          </Route>
          <Route path='/cramer' element={<Cramersrule></Cramersrule>}>
          </Route>
          <Route path='/gausselimination' element={<Gausselimination></Gausselimination>}>
          </Route>
          <Route path='/gaussjordan' element={<Gaussjordan></Gaussjordan>}>
          </Route>
          <Route path='/matrix' element={<Matrix></Matrix>}>
          </Route>
          <Route path='/ludecomposition' element={<Ludecomposition></Ludecomposition>}>
          </Route>
          <Route path='/newtons' element={<Newtons></Newtons>}>
          </Route>
          <Route path='/lagrange' element={<Lagrange></Lagrange>}>
          </Route>
          <Route path='/spline' element={<Spline></Spline>}>
          </Route>
          <Route path='/linear' element={<Linear></Linear>}>
          </Route>
          <Route path='/polynomial' element={<Polynomial></Polynomial>}>
          </Route>
          <Route path='/multiple' element={<Multiple></Multiple>}>
          </Route>
          <Route path='/conjugate' element={<Conjugate></Conjugate>}>
          </Route>
          <Route path='/jacobi' element={<Jacobi></Jacobi>}>
          </Route>
          <Route path='/gaussseidel' element={<Gaussseidel></Gaussseidel>}>
          </Route>
          <Route path='/trapezoidal' element={<Trapezodal></Trapezodal>}>
          </Route>
          <Route path='/simpson' element={<Simpson></Simpson>}>
          </Route>
          <Route path='/compositetra' element={<Compositetra></Compositetra>}>
          </Route>
          <Route path='/compositesim' element={<Compositesim></Compositesim>}>
          </Route>
          <Route path='/central' element={<Central></Central>}>
          </Route>
          <Route path='/backward' element={<Backward></Backward>}>
          </Route>
          <Route path='/forward' element={<Forward></Forward>}>
          </Route>
          <Route path='/backwardoh2' element={<Backwardoh2></Backwardoh2>}>
          </Route>
          <Route path='/centraloh2' element={<Centraloh2></Centraloh2>}>
          </Route>
          <Route path='/forwardoh2' element={<Forwardoh2></Forwardoh2>}>
          </Route>
        </Routes>
      </BrowserRouter>
      {/* <a href='/' class="text-white bg-gradient-to-br from-purple-600 to-blue-500 hover:bg-gradient-to-bl focus:ring-4 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center mr-2 mb-3">
        Home
      </a> */}
    </>

  )

}

export default App
