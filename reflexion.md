# Interface entre grid et simu

## Idée 1 : simu garde en memoire les différences

```javascript
function prepareBuild(what, cursor, radius, flags){
        if(what == 'pv'){
          let cmd = {};
          cmd.grid = grid.getAreaAndAvgIrradiance(cursor, radius, flags);

          let build;
          build.type = 'pv';
          build.area = cmd.grid.area;
          build.effiMul = cmd.grid.avgIrradiance;

          cmd.simu = simu.prepareCapex(build);

          return cmd;
        }
    }

//on build confirmed
function execBuild(cmd){  
  gird.commitBuild(cmd);

  simu.execute(cmd);

}

function Demolish(filterFunction, cursor, radius){
  forEach(pixel in (cursor, radius)){
    if(filterFunction(pixel)){
      (what, flags) = getPixelExistingBuild();
      cmd = prepareBuild(what, cursor, radius, flags);
      cmd.inverse()

      execBuild(cmd)
    }
  }
}
```
```javascript
class Grid {
    addToMap(...){
        return {...} // return a object showing difference on the map
    }
}
```



+ Simu est déjà penser comme ça
+ Sauvegarde de toutes les actions en JSON
- dupplication des infos entre l'affichage et la simulation


## Idée 2 : calculer à la simu la somme des infrastructures de chaque type

```javascript
on(over, ()=>{
    let influence = drawCircle(pos, rad);
    simu.computediff(influence);
})
on(click, ()=>{addToMap(pos, rad);})

function simu.execute() {
    let infra = grid.getInfrastructure();
}
```
On the grid point of view
```javascript
class Grid {
    drawCircle(...){
        return {
            rm:{
                pv:{...},
                nuclear:{...},
                battery:{...},
            },
            add:{
                pv:{...},
                nuclear:{...},
                battery:{...},
            },
        }
    }
    getInfrastructure(){
        foreach(pix){
            let infra = map_infra[pix];
            if(infra.type === pv){
                let infra.efficiency_factor = map_pv_eff[pix]; //factor depend on a map
            }
        }
    }
    return {
                pv:{
                    year:{
                        quality:{
                            eff_factor:covered_surface,
                        },
                    },
                },
                nuclear:{
                    year:{
                        quality:capacity,
                    },
                },
                battery:{
                    year:{
                        quality:capacity,
                    },
                },
            };
}
```

+ Easy to add new solar panel circle on the map.
+ keep separation between ground topography, infrastructures positioning, and other mapping related stuff.
- Simulation demand to check the full map (is that really computer intensive?)
