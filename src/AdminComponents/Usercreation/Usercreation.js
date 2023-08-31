import React from 'react'

const Usercreation = () => {
   return (
      <>
         <div className="section grey lighten-5">
            <div className="container">
               <div className="row">
                  <div className="col xl4 l6 m10 s12 offset-xl4 offset-l3 offset-m1">
                     <h3 className="light center-align blue-text">Sign up form</h3>
                     <div className="card">
                        <div className="card-content">

                           <ul data-method="GET" className="stepper linear">
                              <li className="step active">
                                 <div className="step-title waves-effect waves-dark">E-mail</div>
                                 <div className="step-content">
                                    <div className="row">
                                       <div className="input-field col s12">
                                          <input id="email" name="email" type="email" className="validate" required></input>
                                          <label for="email">Your e-mail</label>
                                       </div>
                                    </div>
                                    <div className="step-actions">
                                       <button className="waves-effect waves-dark btn blue next-step" data-feedback="anyThing">Continue</button>
                                    </div>
                                 </div>
                              </li>
                              <li className="step">
                                 <div className="step-title waves-effect waves-dark">Step 2</div>
                                 <div className="step-content">
                                    <div className="row">
                                       <div className="input-field col s12">
                                          <input id="password" name="password" type="password" className="validate" required></input>
                                          <label for="password">Your password</label>
                                       </div>
                                    </div>
                                    <div className="step-actions">
                                       <button className="waves-effect waves-dark btn blue next-step">CONTINUE</button>
                                       <button className="waves-effect waves-dark btn-flat previous-step">BACK</button>
                                    </div>
                                 </div>
                              </li>
                              <li className="step">
                                 <div className="step-title waves-effect waves-dark">Callback</div>
                                 <div className="step-content">
                                    End!!!!!
                                    <div className="step-actions">
                                       <button className="waves-effect waves-dark btn blue next-step" data-feedback="noThing">ENDLESS CALLBACK!</button>
                                    </div>
                                 </div>
                              </li>
                           </ul>

                        </div>
                     </div>
                  </div>
               </div>
            </div>
         </div>
      </>
   )
}

export default Usercreation