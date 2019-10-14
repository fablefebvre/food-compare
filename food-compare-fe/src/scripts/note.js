var getEnergyNote = function(energy_100g) {
  if (typeof energy_100g !== "undefined") {
    if (energy_100g > 2350) {
      return 10;
    }
    if (energy_100g > 3015) {
      return 9;
    }
    if (energy_100g > 2680) {
      return 8;
    }
    if (energy_100g > 2345) {
      return 7;
    }
    if (energy_100g > 2010) {
      return 6;
    }
    if (energy_100g > 1675) {
      return 5;
    }
    if (energy_100g > 1340) {
      return 4;
    }
    if (energy_100g > 1005) {
      return 3;
    }
    if (energy_100g > 670) {
      return 2;
    }
    if (energy_100g > 335) {
      return 1;
    }
    if (energy_100g <= 335) {
      return 0;
    }
  }
};

var getSaturatedFatNote = function(saturatedFat_100g) {
  if (typeof saturatedFat_100g !== "undefined") {
    if (saturatedFat_100g > 10) {
      return 10;
    }
    if (saturatedFat_100g > 9) {
      return 9;
    }
    if (saturatedFat_100g > 8) {
      return 8;
    }
    if (saturatedFat_100g > 7) {
      return 7;
    }
    if (saturatedFat_100g > 6) {
      return 6;
    }
    if (saturatedFat_100g > 5) {
      return 5;
    }
    if (saturatedFat_100g > 4) {
      return 4;
    }
    if (saturatedFat_100g > 3) {
      return 3;
    }
    if (saturatedFat_100g > 2) {
      return 2;
    }
    if (saturatedFat_100g > 1) {
      return 1;
    }
    if (saturatedFat_100g <= 1) {
      return 0;
    }
  }
};

var getSugarsNote = function(sugars_100g) {
  if (typeof sugars_100g !== "undefined") {
    if (sugars_100g > 10) {
      return 10;
    }
    if (sugars_100g > 9) {
      return 9;
    }
    if (sugars_100g > 8) {
      return 8;
    }
    if (sugars_100g > 7) {
      return 7;
    }
    if (sugars_100g > 27) {
      return 6;
    }
    if (sugars_100g > 22.5) {
      return 5;
    }
    if (sugars_100g > 18) {
      return 4;
    }
    if (sugars_100g > 13.5) {
      return 3;
    }
    if (sugars_100g > 9) {
      return 2;
    }
    if (sugars_100g > 4.5) {
      return 1;
    }
    if (sugars_100g <= 4.5) {
      return 0;
    }
  }
};

var getSodiumNote = function(sodium_100g) {
  if (typeof sodium_100g !== "undefined") {
    if (sodium_100g > 900) {
      return 10;
    }
    if (sodium_100g > 810) {
      return 9;
    }
    if (sodium_100g > 720) {
      return 8;
    }
    if (sodium_100g > 630) {
      return 7;
    }
    if (sodium_100g > 540) {
      return 6;
    }
    if (sodium_100g > 450) {
      return 5;
    }
    if (sodium_100g > 360) {
      return 4;
    }
    if (sodium_100g > 270) {
      return 3;
    }
    if (sodium_100g > 180) {
      return 2;
    }
    if (sodium_100g > 90) {
      return 1;
    }
    if (sodium_100g <= 90) {
      return 0;
    }
  }
};

var getFruitsNote = function(fruits_100g) {
  if (typeof fruits_100g !== "undefined") {
    if (fruits_100g > 80) {
      return 5;
    }
    if (fruits_100g > 60) {
      return 2;
    }
    if (fruits_100g > 40) {
      return 1;
    } else {
      return 0;
    }
  } else {
    return 0;
  }
};

var getFiberNote = function(fiber_100g) {
  if (typeof fiber_100g !== "undefined") {
    if (fiber_100g > 4.7) {
      return 5;
    }
    if (fiber_100g > 3.7) {
      return 4;
    }
    if (fiber_100g > 2.8) {
      return 3;
    }
    if (fiber_100g > 1.9) {
      return 2;
    }
    if (fiber_100g > 0.9) {
      return 1;
    } else {
      return 0;
    }
  } else {
    return 0;
  }
};

var getProteinsNote = function(proteins_100g) {
  if (typeof proteins_100g !== "undefined") {
    if (proteins_100g > 8) {
      return 5;
    }
    if (proteins_100g > 6.4) {
      return 4;
    }
    if (proteins_100g > 4.8) {
      return 3;
    }
    if (proteins_100g > 3.2) {
      return 2;
    }
    if (proteins_100g > 1.6) {
      return 1;
    } else {
      return 0;
    }
  } else {
    return 0;
  }
};

export default {
  getNote(productParam) {
    // note calculated from Serge Hercberg professor see http://solidarites-sante.gouv.fr/IMG/pdf/rapport_Hercberg_15_11_2013.pdf
    var noteSH = undefined;
    if (typeof productParam.nutriments !== "undefined") {
      if ("nutrition-score-fr_100g" in productParam.nutriments) {
        // note already calculated for product
        noteSH = Number(productParam.nutriments["nutrition-score-fr_100g"]);
      } else {
        // if data are available
        if (
          typeof productParam.nutriments["energy_100g"] !== "undefined" &&
          typeof productParam.nutriments["saturated-fat_100g"] !==
            "undefined" &&
          typeof productParam.nutriments["sugars_100g"] !== "undefined" &&
          typeof productParam.nutriments["sodium_100g"] !== "undefined"
        ) {
          // calculating note SH...
          //console.log("calculating noteSH...")
          var energyNote = getEnergyNote(
            productParam.nutriments["energy_100g"]
          );
          var saturatedFatNote = getSaturatedFatNote(
            productParam.nutriments["saturated-fat_100g"]
          );
          var sugarsNote = getSugarsNote(
            productParam.nutriments["sugars_100g"]
          );
          var sodiumNote = getSodiumNote(
            productParam.nutriments["sodium_100g"]
          );
          var fruitsNote = getFruitsNote(
            productParam.nutriments["fruits-vegetables-nuts_100g_estimate"]
          );
          var fiberNote = getFiberNote(productParam.nutriments["fiber_100g"]);
          var proteinsNote = getProteinsNote(
            productParam.nutriments["proteins_100g"]
          );

          //console.log("\nenergyNote=" + energyNote +
          //"\nsaturatedFatNote=" + saturatedFatNote +
          //"\nsugarsNote=" + sugarsNote +
          //"\nsodiumNote=" + sodiumNote +
          //"\nfruitsNote=" + fruitsNote +
          //"\nfiberNote=" + fiberNote +
          //"\nproteinsNote" + proteinsNote);

          // see https://fr.openfoodfacts.org/score-nutritionnel-france to know how the note is calculated
          var noteA = energyNote + saturatedFatNote + sugarsNote + sodiumNote;
          if (noteA >= 11 && fruitsNote < 5) {
            noteSH = noteA - fruitsNote - fiberNote;
          } else {
            noteSH = noteA - fruitsNote - fiberNote - proteinsNote;
          }
          //console.log('noteSH: ' + noteSH);
        } else {
          //not adding the productParam...
        }
      }
      if (typeof noteSH !== "undefined") {
        // calculating a score between 0 and 100
        var result = Math.round(((noteSH * -1 + 40) * 100) / 55);
        return result;
      } else {
        return 0;
      }
    }
  }
}