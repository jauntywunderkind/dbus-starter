"use module"
import { sessionBus, systemBus} from "dbus-native"
import minimist from "minimist"

export const defaults= {
	process(){
		return globalThis.process
	},
	args( argv= this&& this.process().argv|| process.argv){
		return minimist( argv.splice( 2))
	},
	env( env= this&& this.process().env|| process.env){
		return env
	},
	isSession_( args= this&& this.args()|| args()){
		return args.session|| args.s
	},
	isSystem( args= this&& this.args()|| args()){
		return !( args.session|| args.s)
	},
	bus( isSession= this&& this.isSession? this.isSession(): isSession()){
		return isSession? sessionBus(): systemBus()
	}
}

function boundClone( o){
	const clone= {}
	for( let i in o){
		let fn= o[ i]
		if( fn instanceof Function){
			clone[ i]= fn.bind( o)
		}else{
			// not actually a fn, just copy
			clone[ i]= fn
		}
	}
	return clone
}

export function makeConfig( opts= {}){
	let config= {
		process: opts.process|| defaults.process,
		args: opts.args|| defaults.args,
		env: opts.env|| defaults.env,
		isSession: opts.isSession|| defaults.isSession,
		isSystem: opts.isSystem|| defaults.isSystem,
		bus: opts.bus|| defaults.bus
	}
	return boundClone( config)
}

const singleton= makeConfig()
export const
	process= singleton.process,
	args= singleton.args,
	env= singleton.env,
	isSession= singleton.isSession,
	isSystem= singleton.isSystem,
	bus= singleton.bus
