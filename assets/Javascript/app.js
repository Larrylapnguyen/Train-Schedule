$(document).ready(function () {
	var config = {
		apiKey: "AIzaSyB-W0PMGnaSg4liH1kFVN3fJ810FP6qchw",
		authDomain: "ucb-train-hw.firebaseapp.com",
		databaseURL: "https://ucb-train-hw.firebaseio.com",
		projectId: "ucb-train-hw",
		storageBucket: "ucb-train-hw.appspot.com",
		messagingSenderId: "975437907175"
	};
	firebase.initializeApp(config);

	let database = firebase.database();


	$("#subBtn").click(function (event) {
		event.preventDefault();

		let trainName = $("#trainName").val().trim();
		let trainDest = $("#trainDest").val().trim();
		let firstTime = $("#firstTrain").val().trim();
		let trainFreq = $("#trainFreq").val().trim();



		if (trainName === "" || trainDest === "" || firstTime === "" || trainFreq === "") {
			alert("Oops you left something blank.");
			console.log("Empty");
			return false;
		} else if (firstTime >= 2301 || firstTime.length != 4 || isNaN(firstTime) === true) {
			alert("Please check if your Military Time is correct.")
		} else if (isNaN(trainFreq) === true) {
			alert("Please check if your Frequency is correct");
		} else {

			let data = {
				train: trainName,
				dest: trainDest,
				time: firstTime,
				freq: trainFreq,
			}
			database.ref().push(data);

			$("#trainName").val("");
			$("#trainDest").val("");
			$("#firstTrain").val("");
			$("#trainFreq").val("");
		}
	});

	database.ref().on("child_added", function (snapshot) {
		let name = snapshot.val().train;
		let dest = snapshot.val().dest;
		let time = snapshot.val().time;
		let freq = snapshot.val().freq;

		let key = snapshot.key;

		const diff_mins = (start, freq) => {
			var minDiff = Math.abs(moment(time, "HH:mm").diff(moment(), 'minutes')) % freq - freq;
			return Math.abs(minDiff)
		}
		let diff = diff_mins(snapshot.val().time, snapshot.val().freq)
		let arrival = moment().add(diff, 'minutes').format("hh:mm A")

		$("#infoRows").append(`
    <tr id="child-` + key + `">
    <td>` + name + `</td>
    <td>` + dest + `</td>
    <td>` + freq + `</td>
    <td>` + arrival + `</td>
	<td>` + diff + `</td>
	<td><input type="button"  class="btn btn-danger" id="test" value="Test" data-key="` + key + `"></td>
    </tr>`);
	});



	//	Testing button to remove data from Firebase

	$("body").on("click", "#test", function () {
		let removeConfirm = confirm("Are you sure you want to remove?");
		let dataButt = $(this).attr("data-key");
		if (removeConfirm === true) {
			console.log("removing");
			console.log(dataButt);
			database.ref().child(dataButt).remove();
			$("#child-" + dataButt).remove();
		} else {
			console.log("Not Removing");
		}
	});

});