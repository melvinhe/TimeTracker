import { FC } from 'react'
import Bars from './Bars'
import { RecordClassDoc } from '../../types'

/**
 * Interface for graph background
 */
export interface GraphBackgroundProps {
  children: RecordClassDoc[]
  user: string
  setClassName: (className: string) => void
  setStartStamp: (timeStamp: string) => void
  setFinishStamp: (timeStamp: string) => void
  setDuration: (duration: string) => void
}

/**
 * Creates a graph background
 * @param children the records of a user
 * @param user the user's email address
 * @param setClassName a function to set the class name on the modal
 * @param setStartStamp a function to set the start time on the modal
 * @param setFinishStamp a function to set the finish time on the modal
 * @param setDuration a function to set the duration on the modal
 * @returns A graph background
 */
const GraphBackground: FC<GraphBackgroundProps> = ({
  children,
  user,
  setClassName,
  setStartStamp,
  setFinishStamp,
  setDuration,
}) => {
  return (
    <div
      className="bg-white w-2/3 py-2 flex items-center flex-col relative justify-center rounded-lg"
      id="right-box-records"
    >
      <div className="font-bold text-sm" id="records-label">
        {user}'s Time By Class
      </div>
      <div className="px-16 py-4 w-full h-full flex items-end flex-row relative">
        <div className="font-bold absolute inset-y-0 left-2 w-10 flex justify-center items-center">
          <div className="font-bold text-xs -rotate-90" id="y-axis-records">
            Duration
          </div>
        </div>
        <div className="flex w-full h-full gap-2 items-end border border-black border-t-0 border-l-1 border-r-0 border-b-1">
          {children.map((child: RecordClassDoc) => {
            return (
              <Bars
                key={child.uid}
                size={child.duration}
                className={child.class_name}
                startStamp={child.start.toDate().toLocaleString()}
                finishStamp={child.finish.toDate().toLocaleString()}
                setClassName={setClassName}
                setStartStamp={setStartStamp}
                setFinishStamp={setFinishStamp}
                setDuration={setDuration}
              />
            )
          })}
        </div>
      </div>
    </div>
  )
}

export default GraphBackground
