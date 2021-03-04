var app = angular.module('TransformersApp', []);

app.controller('BattleController', function($scope, BattleRulesService, TransformerDecoratorFactory) {

  $scope.transformersInput;

  $scope.setLoosingTeam = function() {
    if ($scope.autobotVictories - $scope.decepticonVictories !== 0) {
      $scope.loosingTeam = $scope.autobotVictories > $scope.decepticonVictories ? "D" : "A";
    } else {
      $scope.loosingTeam = "TIED";
    }
  };

  $scope.setRemainingBots = function() {
    $scope.remainingBots = angular.equals($scope.loosingTeam, "D") ? $scope.decepticons : $scope.autobots;
  };

  $scope.setLastWinner = function(winnerBots, loosingTeam) {
    var winners = _.remove(winnerBots, function(transformer) {
      return !angular.equals(transformer.team, loosingTeam);
    });

    $scope.lastWinner = winners[winners.length - 1];
  };

  $scope.increaseTeamPoints = function(winner) {
    if (angular.equals(winner.team, "D")) {
      $scope.decepticonVictories++;
    } else {
      $scope.autobotVictories++;
    }
  };

  $scope.resetArena = function() {
    $scope.battleLineup = [];
    $scope.autobots = [];
    $scope.decepticons = [];

    $scope.winnerBots = [];
    $scope.remainingBots = [];

    $scope.amountOfBattles = 0;
    $scope.autobotVictories = 0;
    $scope.decepticonVictories = 0;
    $scope.loosingTeam = "";
  };

  $scope.prepareTeams = function(allTransformers) {
    $scope.autobots = _.sortBy(allTransformers, 'rank');

    $scope.decepticons = _.remove($scope.autobots, function(transformer) {
      return angular.equals(transformer.team, "D");
    });
  };

  $scope.checkBothTeamsHaveFighters = function() {
    return $scope.autobots.length > 0 && $scope.decepticons.length > 0;
  };

  $scope.handleErrorException = function(error) {
    switch (error.type) {
      case 'OptimusPredakingBattleException':
        alert(error.title + " " + error.message);
        break;
      case 'InvalidTransformerException':
        alert(error.title  + " " + error.message);
        break;
      case 'BattleTiedException':
          console.log(error.title + ": " + error.message);
          break;
      default:
        break;
    }
  };

  $scope.resolveBattles = function() {

    $scope.resetArena();

    try {

      $scope.transformersInput.forEach(function(value, key) {
        $scope.battleLineup.push(TransformerDecoratorFactory.decorateTransformer(value));
      });

      $scope.prepareTeams($scope.battleLineup);

      while ($scope.checkBothTeamsHaveFighters()) {
        $scope.amountOfBattles++;

        var autobot = $scope.autobots.pop();
        var decepticon = $scope.decepticons.pop();

        var winner = BattleRulesService.resolveFaceOff(autobot, decepticon);

        if(angular.isDefined(winner)){
          $scope.increaseTeamPoints(winner); 
          $scope.winnerBots.push(winner);
        }
      }
    } catch (error) {

      $scope.handleErrorException(error);
    }

    $scope.setLoosingTeam();
    $scope.setRemainingBots();
    $scope.setLastWinner($scope.winnerBots, $scope.loosingTeam);
  };

});