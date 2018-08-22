// documentation utilities

// formatting of the documentation is done as a regular output type
// that is therefore in output.js

window._manualRunMenuSysDocPrepare = function(menuitem) {
  var target = document.querySelector(".run-command #target").value;
  target = target ? "target" : "all minions";
  var command = document.querySelector(".run-command #command").value;
  // remove the command arguments
  command = command.trim().replace(/ .*/, "");
  command = command.trim().replace(/[.]*$/, "");
  if(!command.match(/^[a-z.]*$/i)) {
    // when it is not a command, don't treat it as a command
    menuitem.style.display = "none";
  } else if(!command) {
    // this spot was reserved for `sys.doc` without parameters
    // but that is far too slow for normal use
    menuitem.style.display = "none";
  } else if(command === "runners" || command.startsWith("runners.")) {
    // actually 'command' is not passed, but we select that part of the actual result
    // because `runners.doc.runner` always returns all documentation for `runners'
    command = command.substring(8);
    if(command) command = " " + command;
    menuitem.innerText = "Run 'runners.doc.runner" + command + "'";
    menuitem.style.display = "block";
  } else if(command === "wheel" || command.startsWith("wheel.")) {
    // actually 'command' is not passed, but we select that part of the actual result
    // because `runners.doc.wheel` always returns all documentation for `wheel'
    command = command.substring(6);
    if(command) command = " " + command;
    menuitem.innerText = "Run 'runners.doc.wheel" + command + "'";
    menuitem.style.display = "block";
  } else {
    menuitem.innerText = "Run 'sys.doc " + command + "' on " + target;
    menuitem.style.display = "block";
  }
}

window._manualRunMenuSysDocRun = function() {
  var button = document.querySelector(".run-command input[type='submit']");
  if(button.disabled) return;
  var output = document.querySelector(".run-command pre");

  var target = document.querySelector(".run-command #target").value;
  // the help text is taken from the first minion that answers
  // when no target is selectes, just ask all minions
  if(target === "") target = "*";

  // do not use the command-parser
  var command = document.querySelector(".run-command #command").value;
  // remove arguments
  command = command.trim().replace(/ .*/, "");
  // remove trailing dots
  command = command.trim().replace(/[.]*$/, "");
  // command can be empty here (but the gui prevents that)

  button.disabled = true;
  output.innerHTML = "Loading...";

  let docCommand;
  let dummyCommand;
  if(command === "runners" || command.startsWith("runners.")) {
    // runners command. docCommand is WITHOUT further arguments
    docCommand = "runners.doc.runner";
    dummyCommand = "runners.doc.runner " + command;
  } else if(command === "wheel" || command.startsWith("wheel.")) {
    // wheel command. docCommand is WITHOUT further arguments
    docCommand = "runners.doc.wheel";
    dummyCommand = "runners.doc.wheel " + command;
  } else {
    // regular command. docCommand is WITH further argument
    docCommand = "sys.doc " + command;
    dummyCommand = "sys.doc " + command;
  }

  this._getRunParams(target, docCommand).then(
    arg => { this._onRunReturn(dummyCommand, arg); },
    arg => { this._onRunReturn(dummyCommand, arg); }
    );
}
