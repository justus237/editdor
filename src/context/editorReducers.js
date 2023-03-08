/********************************************************************************
 * Copyright (c) 2018 - 2020 Contributors to the Eclipse Foundation
 *
 * See the NOTICE file(s) distributed with this work for additional
 * information regarding copyright ownership.
 *
 * This program and the accompanying materials are made available under the
 * terms of the Eclipse Public License v. 2.0 which is available at
 * http://www.eclipse.org/legal/epl-2.0, or the W3C Software Notice and
 *
 * SPDX-License-Identifier: EPL-2.0 OR W3C-20150513
 ********************************************************************************/
import { Servient } from "@node-wot/core";
import { HttpsClientFactory, HttpClientFactory } from "@node-wot/binding-http";
export const UPDATE_OFFLINE_TD = 'UPDATE_OFFLINE_TD';
export const UPDATE_IS_MODFIED = 'UPDATE_IS_MODFIED';
export const UPDATE_IS_THINGMODEL = 'UPDATE_IS_THINGMODEL';
export const SET_FILE_HANDLE = 'SET_FILE_HANDLE';
export const REMOVE_FORM_FROM_TD = 'REMOVE_FORM_FROM_TD';
export const REMOVE_LINK_FROM_TD = 'REMOVE_LINK_FROM_TD';
export const ADD_PROPERTYFORM_TO_TD = 'ADD_PROPERTYFORM_TO_TD';
export const ADD_ACTIONFORM_TO_TD = 'ADD_ACTIONFORM_TO_TD';
export const ADD_EVENTFORM_TO_TD = 'ADD_EVENTFORM_TO_TD';
export const REMOVE_ONE_OF_A_KIND_FROM_TD = 'REMOVE_ONE_OF_A_KIND_FROM_TD';
export const UPDATE_SHOW_CONVERT_BTN = 'UPDATE_SHOW_CONVERT_BTN';
export const ADD_LINKED_TD = 'ADD_LINKED_TD';
export const UPDATE_LINKED_TD = 'UPDATE_LINKED_TD';
export const UPDATE_VALIDATION_MESSAGE = 'UPDATE_VALIDATION_MESSAGE';
export const EXECUTE_FORM = 'EXECUTE_FORM';

const updateOfflineTDReducer = (offlineTD, state) => {
  console.log("updateOfflineTDReducer")
  console.log(offlineTD)
  let linkedTd=state.linkedTd
  try{
    //If the user write Thing description without wizard, we save it in linkedTd
    if(!linkedTd){
      let parsedTd=JSON.parse(offlineTD)
      linkedTd={}
      let href=parsedTd["title"]||"ediTDor Thing"
      linkedTd[href]=parsedTd
    }
    else if(linkedTd&& typeof state.fileHandle !== "object"){
      let parsedTd=JSON.parse(offlineTD)
      if(document.getElementById("linkedTd")){
        let href= document.getElementById("linkedTd").value
        if(href===""){
        linkedTd[parsedTd["title"]||"ediTDor Thing"]=parsedTd
        }
        else{
          linkedTd[href]=parsedTd
        }
      }
    }
  }catch(e){
    let error = e.message;
    console.log(error)
  }
  return { ...state, offlineTD, isModified: true, linkedTd:linkedTd };
};

const removeFormReducer = (form, state) => {
  console.log("removeFormReducer")
  console.log(form)
  let offlineTD = JSON.parse(state.offlineTD)
  console.log(form);
  if (form.type === 'forms') {
    offlineTD.forms.forEach((element, i) => {
      if (typeof (element.op) === 'string') {
          offlineTD.forms.splice(i, 1)
      } else {
        if (element.href === form.form.href && element.op.indexOf(form.form.op) !== -1) {
          element.op.splice(element.op.indexOf(form.form.op), 1)
        }
        if (element.op.length === 0) {
          offlineTD.forms.splice(i, 1)
        }
      }
    });
  } else {
    try {
      offlineTD[form.type][form.propName].forms.forEach((element, i) => {
        if (typeof (element.op) === 'string') {
          if (element.href === form.form.href) {
            offlineTD[form.type][form.propName].forms.splice(i, 1)
          }
        } else {
          if (element.href === form.form.href && element.op.indexOf(form.form.op) !== -1) {
            element.op.splice(element.op.indexOf(form.form.op), 1)
          }
          if (element.op.length === 0) {
            offlineTD[form.type][form.propName].forms.splice(i, 1)
          }
        }
      });
    } catch (e) {
      alert('Sorry we were unable to delete the Form.');
    }
  }
  return { ...state, offlineTD: JSON.stringify(offlineTD, null, 2) };
};

const removeLinkReducer = (index, state) => {
  console.log("removeLinkReducer")
  console.log(index)
  let offlineTD = JSON.parse(state.offlineTD)
    try {
      offlineTD["links"].splice(index,1)
    } catch (e) {
      alert('Sorry we were unable to delete the Link.');
    }
  let linkedTd=state.linkedTd
  if(linkedTd&& typeof state.fileHandle !== "object"){
    if(document.getElementById("linkedTd")){
      let href= document.getElementById("linkedTd").value
      if(href===""){
      linkedTd[offlineTD["title"]||"ediTDor Thing"]=offlineTD
      }
      else{
        linkedTd[href]=offlineTD
      }
    }
  }
  return { ...state, offlineTD: JSON.stringify(offlineTD, null, 2),linkedTd:linkedTd };
};

const removeOneOfAKindReducer = (kind, oneOfAKindName, state) => {
  console.log("removeOneOfAKindReducer")
  console.log(oneOfAKindName)
  let offlineTD = JSON.parse(state.offlineTD)
  try {
    delete offlineTD[kind][oneOfAKindName]
  } catch (e) {
    alert('Sorry we were unable to delete the Form.');
  }
  return { ...state, offlineTD: JSON.stringify(offlineTD, null, 2) };
};

const addPropertyFormReducer = (form, state) => {
  console.log("addPropertyFormReducer")
  console.log(form)
  let offlineTD = JSON.parse(state.offlineTD)
  const property = offlineTD.properties[form.propName];
  if (property.forms === undefined) {
    property.forms = []
  }
  property.forms.push(form.form);
  return { ...state, offlineTD: JSON.stringify(offlineTD, null, 2) };
};

const addLinkedTd = (td, state) =>{
  console.log("addLinkedTd")
  console.log(td)
  let resultingLinkedTd ={}
  let linkedTd= state.linkedTd

  if(linkedTd === undefined){
     resultingLinkedTd=td
  }
  else{
  resultingLinkedTd = Object.assign(linkedTd, td)
  }
  return { ...state, linkedTd: resultingLinkedTd };
}

const updateLinkedTd = (td, state) =>{
  console.log("updateLinkedTd")
  console.log(td)
  return { ...state, linkedTd: td };
}

const addActionFormReducer = (params, state) => {
  console.log("addActionFormReducer")
  console.log(params)
  let offlineTD = JSON.parse(state.offlineTD)
  const action = offlineTD.actions[params.actionName];
  console.log('ActionForms', action.forms)
  if (action.forms === undefined) {
    action.forms = []
  }
  action.forms.push(params.form);
  return { ...state, offlineTD: JSON.stringify(offlineTD, null, 2) };
};

const addEventFormReducer = (params, state) => {
  console.log("addEventFormReducer")
  console.log(params)
  let offlineTD = JSON.parse(state.offlineTD)
  const event = offlineTD.events[params.eventName];
  if (event.forms === undefined) {
    event.forms = []
  }
  event.forms.push(params.form);
  return { ...state, offlineTD: JSON.stringify(offlineTD, null, 2) };
};

const updateIsModified = (isModified, state) => {
  console.log("updateIsModified")
  console.log(isModified)
  return { ...state, isModified: isModified };
};

const updateIsThingModel = (isThingModel, state) => {
  console.log("updateIsThingModel")
  console.log(isThingModel)
  return { ...state, isThingModel: isThingModel };
};

const updateFileHandleReducer = (fileHandle, state) => {
  console.log("updateFileHandleReducer")
  console.log(fileHandle)
  return { ...state, fileHandle: fileHandle };
};

const updateShowConvertBtn = (showConvertBtn, state) => {
  console.log("updateShowConvertBtn")
  console.log(showConvertBtn)
  return { ...state, showConvertBtn: showConvertBtn };
};

const updateValidationMessage = (validationMessage, state) => {
  console.log("updateValidationMessage")
  console.log(validationMessage)
  return { ...state, validationMessage };

};

const executeHTTPOfFormReducer = (form, state) => {
  console.log(form)
  const offlineTD = JSON.parse(state.offlineTD)
  const servient = new Servient();
  if (offlineTD.securityDefinitions) {
    const secDefs = Object.values(offlineTD.securityDefinitions)
    if (secDefs.length === 1) {
      const scheme = secDefs[0].scheme
      if (scheme === "basic") {
        const tdId = offlineTD.id;
        const username = window.prompt("HTTP basic auth username","!!! this will be stored in plaintext in memory on the server!!!");
        const password = window.prompt("HTTP basic auth password","!!! this will be stored in plaintext in memory on the server!!!");
        let credentials = {}
        credentials[tdId] = {username: username, password: password}
        servient.addCredentials(credentials);
      } else if (scheme === "nosec") {
        //nothing to do
      } else {
        //TODO implement security definitions other than basic and nosec
        window.alert("TODO implement security definitions other than basic and nosec")
        return state
      }
    } else {
      //TODO wait for node-wot to implement multiple security definitions
      window.alert("TODO node-wot does not currently allow for multiple security definitions")
    }
  }
  
  let httpConfig = {
    allowSelfSigned: true, // client configuration
  };
  servient.addClientFactory(new HttpsClientFactory(httpConfig));
  servient.addClientFactory(new HttpClientFactory(httpConfig));
  servient.start()
  .then((WoT) => {
    return WoT.consume(offlineTD)
  })
  .then((thing) => {
    switch (form.form.op) {
      case "readproperty":
        return thing.readProperty(form.propName)
      case "writeproperty":
        let input = window.prompt("value for ", form.propName, "")
        console.log("writing value to property")
        console.log(input)
        if (offlineTD.properties[form.propName].type) {
          switch (offlineTD.properties[form.propName].type) {
            case "string":
              input = String(input)
              break
            case "number":
              input = Number(input)
              break
            case "integer":
              input = Number(input)
              break
            case "boolean":
              input = Boolean(input)
              break
            default:
              throw new Error("TODO writing object/array typed properties not implemented, use JSON.parse for this maybe")
          }
        }
        thing.writeProperty(form.propName, input)
        .then(() => console.log("wrote property successfully"))
        .catch((err) => console.log(err.stack))
        return undefined
      case "invokeaction":
        if ("input" in offlineTD.actions[form.propName]) {
          console.log("requires input")
          if ("type" in offlineTD.actions[form.propName].input) {
            if (offlineTD.actions[form.propName].input.type === "string") {
              const input = window.prompt("string input for ", form.propName, "")
              return thing.invokeAction(form.propName, input)
            } else if (offlineTD.actions[form.propName].input.type === "number") {
              const input = window.prompt("number input for ", form.propName, "")
              return thing.invokeAction(form.propName, Number(input))
            } else if (offlineTD.actions[form.propName].input.type === "boolean") {
              const input = window.prompt("boolean input for ", form.propName, "")
              return thing.invokeAction(form.propName, Boolean(input))
            } else if (offlineTD.actions[form.propName].input.type === "integer") {
              const input = window.prompt("integer input for ", form.propName, "")
              return thing.invokeAction(form.propName, Number(input))
            } else {
              throw Error("unimplemented or unknown dataschema type for input (TODO use JSON.parse for this)")
            }
          } else {
            throw Error("found input requirement but no dataschema")
          }
        } else {
          console.log("invoking action without input")
          return thing.invokeAction(form.propName)
        }
      default:
        throw Error("not yet implemented operation")
    }
  })
  .then((interactionOutput) => {
    if (interactionOutput) {
      return interactionOutput.value()
    } else {
      throw new Error("no output/value produced")
    }
  })
  .then((value) => {
    window.alert(String(value))
  })
  .catch((error) => window.alert(error.message))
  return state
}


const editdorReducer = (state, action) => {
  console.log("editdorReducer")
  switch (action.type) {
    case UPDATE_OFFLINE_TD:
      return updateOfflineTDReducer(action.offlineTD, state);
    case UPDATE_IS_MODFIED:
      return updateIsModified(action.isModified, state);
    case UPDATE_IS_THINGMODEL:
      return updateIsThingModel(action.isThingModel, state);
    case SET_FILE_HANDLE:
      const newState = updateFileHandleReducer(action.fileHandle, state)
      return newState;
    case REMOVE_FORM_FROM_TD:
      return removeFormReducer(action.form, state)
    case REMOVE_LINK_FROM_TD:
        return removeLinkReducer(action.link, state)
    case REMOVE_ONE_OF_A_KIND_FROM_TD:
      return removeOneOfAKindReducer(action.kind, action.oneOfAKindName, state)
    case ADD_PROPERTYFORM_TO_TD:
      return addPropertyFormReducer(action.form, state)
    case ADD_ACTIONFORM_TO_TD:
      return addActionFormReducer(action.params, state)
    case ADD_EVENTFORM_TO_TD:
      return addEventFormReducer(action.params, state)
    case UPDATE_SHOW_CONVERT_BTN:
      return updateShowConvertBtn(action.showConvertBtn, state);
    case ADD_LINKED_TD:
      return addLinkedTd(action.linkedTd,state)
    case UPDATE_LINKED_TD:
      return updateLinkedTd(action.linkedTd,state)
    case UPDATE_VALIDATION_MESSAGE:
      return updateValidationMessage(action.validationMessage, state)
    case EXECUTE_FORM:
      return executeHTTPOfFormReducer(action.form, state)
    default:
      return state;
  }
};

export { editdorReducer }
