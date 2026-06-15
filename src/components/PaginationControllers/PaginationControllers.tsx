import './PaginationControllers.scss';
import Button from "../Button/Button";

interface PaginationControllersProps {
  currentPage: number;
  totalPages: number;
  onChangePage: (data: number) => void
  hasNext: boolean;
}

function PaginationControllers(props: PaginationControllersProps) {
  const {currentPage, hasNext, onChangePage} = props;

  return(
    <div className="pagination-controllers">
      <Button text='Prev' type="button" onClick={() => onChangePage(currentPage - 1)} disabled={currentPage === 1} />
      <span className="pagination-controllers__current-page">{currentPage}</span>
      <Button text='Next' type="button" onClick={() => onChangePage(currentPage + 1)} disabled={!hasNext} />
    </div>
  )
}

export default PaginationControllers;