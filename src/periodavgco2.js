// Copyright 2020, ASBL Math for climate, All rights reserved.


// compute the average co2 per year on the given period. from = index of 1st. to = index of last (not included)
export function periodAvgCo2(history, from, to){
    const energies = ['nuke', 'pv', 'fossil', 'storage', 'ccgt', 'wind', 'fusion'];

    const begin = from;

    let avgCo2 = 0;


    for(let i = begin; i < to; i++){
        let emi = history[i].co2;


        energies.forEach((item) => {avgCo2 += emi.build[item];});
        energies.forEach((item) => {avgCo2 += emi.perWh[item] + emi.perYear[item];});
    }

    avgCo2 /= to - from; //sum to avg

    return avgCo2;
}
