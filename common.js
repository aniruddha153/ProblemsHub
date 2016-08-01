$(function(){

	var url = "http://hackerearth.0x10.info/api/problems?type=json&query=list_problems";
	var apiHitsUrl = "http://hackerearth.0x10.info/api/problems?type=json&query=api_hits";
	
	var problemsObj = {};
	var problems = [];
	$.getJSON(url, function(resultData){
		problemsObj = resultData.problems;

		$.each(problemsObj, function(index, problem){
			if(problem.image != null)
				problems.push(problem);
		});

		populateProblems(problems);
	});

	var apiHits = {}
	$.getJSON(apiHitsUrl, function(resultData){
		apiHits = resultData.api_hits;
		$(".TotalAPIHits").find(".badge").text(apiHits);
	});

	$('.SortByRating').on("click", function(){
		sortByRating(problems, $(this));
	});

	$('.SortByLikes').on("click", function(){
		sortByLikes(problems, $(this));
	});

	var totalLikeCount = parseInt(localStorage.getItem("totalLikeCount")) ? parseInt(localStorage.getItem("totalLikeCount")) : 0;
	$(".TotalLikes").find(".badge").text(totalLikeCount);

});

function populateProblems(problems){

	$(".ProblemsContainer").empty();

	var rowId = 0;
	for(var i = 0; i < problems.length; i++){
		if((i+1)%2 == 1){
			rowId++;
			var probWrapperRow = $("<div class='row problems-wrapper'></div>");
			probWrapperRow.attr("data-row", rowId)
			$(".ProblemsContainer").append(probWrapperRow);
		}
	}

	var probItem = $("<div class='col-xs-12 col-sm-6 problem'><div class='thumbnail'></div></div>");
	var rowId = 0;
	$.each(problems, function(index, problem){

		if((index + 1)%2 == 1){
			rowId++;
		}

		//if(problem.image === null) return;

		var problemId = index + 1;
		problem.problemId = problemId;

		var probItemClone = probItem.clone();

		var imageField = "<img src='" + problem.image + "' class='pull-left'/>";
		var nameField = "<h4 class='prob-name'>" + problem.name + "</h4>";
		var solvedByField = "<span class='label label-success prob-solvedby'><span class='glyphicon glyphicon-user' aria-hidden='true'></span>  Solved by " + problem.solved_by + "</span>";
		var ratingField = " <span class='label label-primary prob-rating'><span class='glyphicon glyphicon-star' aria-hidden='true'></span>  &nbsp;" + problem.rating + "</span>";
		var parentChallengeField = "<div class='prob-detail'><span class='glyphicon glyphicon-home' aria-hidden='true'></span> &nbsp;" + problem.parent_challenge + "</div>";
		var urlField = "<div class='prob-detail'><span class='glyphicon glyphicon-link' aria-hidden='true'></span> &nbsp;<a href='" + problem.url + "' target='_blank'>Click Here To View Problem</a></div>";
		
		var tagsField = "<div class='prob-detail'><span class='glyphicon glyphicon-tags' aria-hidden='true'></span> &nbsp;";
		$.each(problem.tags, function(i, tag){
			tagsField += "<span>" + tag + ", <span>";
		});
		tagsField += "</div>";

		var likeButton = "<button id='Like_" + problem.problemId +"' type='button' class='btn btn-primary btn-xs LikeButton'><span class='glyphicon glyphicon-thumbs-up' aria-hidden='true'></span><span class='LikeCount'></span></button>";

		probItemClone.find(".thumbnail").html(imageField + "<div class='caption'>" + nameField + solvedByField + ratingField + parentChallengeField + tagsField + urlField + likeButton + "</div><div class='clearfix'></div>");
		probItemClone.data("settings", problem);

		$(".row.problems-wrapper[data-row='" + rowId + "']").append(probItemClone);
	});

	$('.ProblemsContainer').append(probWrapperRow);

	var likeButtons = $(".LikeButton");
	likeButtons.each(function(){
		var buttonId = $(this).attr("id");
		var currLikeCount = parseInt(localStorage.getItem(buttonId)) ? parseInt(localStorage.getItem(buttonId)) : 0;
		$("#" + buttonId).find('.LikeCount').html(" " + currLikeCount);
	});

	$('.LikeButton').on("click", function(e){
		var buttonId = $(e.target).closest('.LikeButton').attr("id");
		var settings = $(e.target).closest('.problem').data("settings");
		setLikeCount(settings, buttonId);
	});
}

function setLikeCount(settings, buttonId){
	var currLikeCount = parseInt(localStorage.getItem(buttonId)) ? parseInt(localStorage.getItem(buttonId)) : 0;
	localStorage.setItem(buttonId, ++currLikeCount);
	$("#" + buttonId).find('.LikeCount').html(" " + currLikeCount);
	$.extend(settings, {likeCount : currLikeCount});

	var totalLikeCount = parseInt(localStorage.getItem("totalLikeCount")) ? parseInt(localStorage.getItem("totalLikeCount")) : 0;
	localStorage.setItem("totalLikeCount", ++totalLikeCount);
	$(".TotalLikes").find(".badge").text(localStorage.getItem("totalLikeCount"));
}

function sortByRating(problems, button){
	problems.sort(function(a, b){
		return parseFloat(a.rating) - parseFloat(b.rating);
	});

	if(button.hasClass("HighToLow")){
		problems.reverse();		
	}

	populateProblems(problems);
}

function sortByLikes(problems, button){
	problems.sort(function(a, b){
		return parseFloat(a.likeCount) - parseFloat(b.likeCount);
	});

	if(button.hasClass("HighToLow")){
		problems.reverse();		
	}

	populateProblems(problems);
}